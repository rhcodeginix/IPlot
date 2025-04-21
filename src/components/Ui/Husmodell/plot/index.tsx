import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Button from "@/components/common/button";
import PlotFilterSection from "./plotFilterSection";
import PlotProperty from "./plotProperty";
import { Settings2, X } from "lucide-react";
import { Drawer } from "@mui/material";
import Loading from "@/components/Loading";

const Plots: React.FC<{
  handlePrevious: any;
  handleNext: any;
  HouseModelData: any;
}> = ({ handlePrevious, handleNext, HouseModelData }) => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlots = HouseModelProperty.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const [formData, setFormData] = useState({
    address: "",
    minRangeForPlot: 0,
    maxRangeForPlot: 10000000,
    Område: [] as string[],
    SubOmråde: [] as string[],
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const maxRangePlot = queryParams.get("maxRangePlot");
    const minRangePlot = queryParams.get("minRangePlot");

    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : prev.maxRangeForPlot,
      minRangeForPlot: minRangePlot
        ? Number(minRangePlot)
        : prev.minRangeForPlot,
    }));
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const minRangePlot = Number(queryParams.get("minRangePlot") || 0);
        const maxRangePlot = Number(
          queryParams.get("maxRangePlot") || Infinity
        );
        const husodellId = queryParams.get("husodellId");
        const cityQuery = queryParams.get("city");

        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");

        const cityFormLocalStorage: string[] = JSON.parse(
          localStorage.getItem("city") || "[]"
        );
        const subCityFormLocalStorage: string[] = JSON.parse(
          localStorage.getItem("subcity") || "[]"
        );

        const cleanedCities =
          cityQuery?.split(",").map((city) => city.trim()) || [];

        const citiesToUse =
          cityFormLocalStorage.length > 0
            ? cityFormLocalStorage
            : cleanedCities;

        setFormData((prev) => ({
          ...prev,
          Område: citiesToUse,
          SubOmråde:
            subCityFormLocalStorage.length > 0 ? subCityFormLocalStorage : [],
        }));
        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const allCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const matchedCities = allCities.filter((property: any) =>
          citiesToUse.includes(property.name)
        );

        if (!matchedCities.length) {
          setHouseModelProperty([]);
          return;
        }

        const kommuneNumbers: number[] = matchedCities
          .flatMap((city: any) => {
            if (subCityFormLocalStorage.length > 0) {
              const matched =
                city.kommunerList?.filter((k: any) =>
                  subCityFormLocalStorage.includes(k.name)
                ) || [];

              if (matched.length > 0) {
                return matched.map((k: any) => parseInt(k.number, 10));
              }
            }

            return Object.values(city.kommunenummer).map((val: any) =>
              parseInt(
                typeof val === "string"
                  ? val.replace(/"/g, "")
                  : val.toString(),
                10
              )
            );
          })
          .filter((num: any) => !isNaN(num));

        if (!kommuneNumbers.length) {
          setHouseModelProperty([]);
          return;
        }

        const husmodellDocRef = doc(db, "house_model", String(husodellId));
        const husmodellSnap = await getDoc(husmodellDocRef);

        if (!husmodellSnap.exists()) {
          console.error("No such house model document!");
          setHouseModelProperty([]);
          return;
        }

        const allHusmodell = [
          {
            propertyId: husmodellSnap.id,
            ...husmodellSnap.data(),
          },
        ];

        const plotsRef = collection(db, "empty_plot");
        const chunkSize = 10;
        const allPlots: any[] = [];

        for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
          const chunk = kommuneNumbers.slice(i, i + chunkSize);
          const q = query(
            plotsRef,
            where(
              "lamdaDataFromApi.searchParameters.kommunenummer",
              "in",
              chunk
            )
          );
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data?.CadastreDataFromApi?.presentationAddressApi) {
              allPlots.push({ id: doc.id, ...data });
            }
          });
        }

        const filteredPlots = allPlots.filter(
          (plot) => plot.pris >= minRangePlot && plot.pris <= maxRangePlot
        );

        const combinedData: any = filteredPlots.flatMap((plot) =>
          allHusmodell.map((house) => ({ plot, house }))
        );

        setHouseModelProperty(combinedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [router.asPath]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    const chatBot = document.getElementById("chatbase-bubble-button");
    const addPlot = document.getElementById("addPlot");
    const navbar = document.getElementById("navbar");

    if (openDrawer) {
      if (chatBot) chatBot.style.display = "none";
      if (addPlot) addPlot.style.display = "none";
      if (navbar) navbar.style.zIndex = "999";
    } else {
      if (chatBot) chatBot.style.display = "block";
      if (addPlot) addPlot.style.display = "block";
      if (navbar) navbar.style.zIndex = "9999";
    }
  }, [openDrawer]);
  return (
    <>
      <div className="relative pt-5 md:pt-8">
        <SideSpaceContainer>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 md:gap-3 lg:gap-4 mb-6 lg:mb-[40px]">
            <h3 className="text-darkBlack text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Tomter</span> der du kan bygge{" "}
              <span className="text-[#6938EF] font-bold">
                {HouseModelData?.Husdetaljer?.husmodell_name}
              </span>
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">2 206</span> annonser
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-5 laptop:gap-6 relative pb-[56px]">
            <div className="lg:w-[35%]">
              <div
                className="sticky top-[56px] w-max left-0 right-0 z-50 bg-white border rounded-lg border-[#DADDE8] p-2 gap-2 flex items-center justify-between lg:hidden"
                onClick={toggleDrawer(true)}
              >
                <Settings2 className="text-[#7839EE] h-5 w-5" />
                <h4 className="text-sm">Filter</h4>
              </div>
              <div className="hidden lg:block w-full">
                <PlotFilterSection
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="relative w-full lg:w-[65%]">
                <Loading />
              </div>
            ) : (
              <div className="w-full lg:w-[65%]">
                <PlotProperty
                  HouseModelProperty={currentPlots}
                  isLoading={isLoading}
                  handleNext={handleNext}
                />
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">{currentPage}</span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev <
                        Math.ceil(HouseModelProperty.length / itemsPerPage)
                          ? prev + 1
                          : prev
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(HouseModelProperty.length / itemsPerPage)
                    }
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </SideSpaceContainer>

        <div
          className="sticky bottom-0 bg-white py-4 md:py-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            zIndex: 9999999,
          }}
        >
          <SideSpaceContainer>
            <div className="flex justify-end gap-4 items-center">
              <Button
                text="Tilbake"
                className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                onClick={() => {
                  handlePrevious();
                }}
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "90vh",
          },
          className: "filterDrawer",
        }}
      >
        <div className="overflow-y-auto max-h-[90vh] pt-4 bg-[#F9F5FF]">
          <PlotFilterSection formData={formData} setFormData={setFormData} />
          <div className="absolute top-3 right-2" onClick={toggleDrawer(false)}>
            <X className="h-4 w-4" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Plots;
