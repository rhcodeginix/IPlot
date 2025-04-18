import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Button from "@/components/common/button";
import HusmodellFilterSection from "./husmodellFilterSection";
import HusmodellProperty from "./HusmodellProperty";
import { Settings2, X } from "lucide-react";
import { Drawer } from "@mui/material";

const HusmodellPropertyPage: React.FC = () => {
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [maxRangeData, setMaxRangeData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: maxRangeData,
    Tomtetype: [] as string[],
  });
  const [total, setTotal] = useState();

  useEffect(() => {
    const storedMaxPrice = sessionStorage.getItem("maxHousePrice");
    if (storedMaxPrice) {
      setMaxRangeData(parseInt(storedMaxPrice, 10));
      setFormData((prev) => ({
        ...prev,
        maxRangeForHusmodell: parseInt(storedMaxPrice, 10),
      }));
    }
  }, []);

  const [kommune, setKommune] = useState<any>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const cityQuery = queryParams.get("Kommue");
    setKommune(cityQuery);
  }, []);
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "house_model"))
        );
        const data: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const maxHousePrice = Math.max(
          ...data?.map((house: any) =>
            parseInt(house?.Husdetaljer?.pris.replace(/\s/g, ""), 10)
          )
        );

        sessionStorage.setItem("maxHousePrice", maxHousePrice.toString());
        setMaxRangeData(maxHousePrice);
      } catch (error) {
        console.error("Error fetching max price:", error);
      }
    };

    fetchMaxPrice();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);

      try {
        const q = query(collection(db, "house_model"));

        const querySnapshot = await getDocs(q);

        const data: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTotal(data.length);
        const soveromValues = formData?.AntallSoverom.map((item: any) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );
        const filterData =
          data.filter((house: any) => {
            const houseDetails = house?.Husdetaljer || {};
            const housePrice = parseInt(
              houseDetails?.pris?.replace(/\s/g, "") || "0",
              10
            );

            const boligtype = houseDetails?.VelgBoligtype;
            const egenskaper = houseDetails?.VelgEgenskaperBoligtype || [];
            const hasEgenskaper = egenskaper.length > 0;

            const hasBedroomFilter = formData.AntallSoverom.length > 0;
            const hasMinPriceFilter = formData.minRangeForHusmodell !== 0;
            const hasMaxPriceFilter = formData.maxRangeForHusmodell !== 0;
            const hasTypeFilter = formData.TypeHusmodell.length > 0;

            const matchesBedrooms =
              !hasBedroomFilter || soveromValues.includes(houseDetails.Soverom);
            const matchesMinPrice =
              !hasMinPriceFilter || housePrice >= formData.minRangeForHusmodell;
            const matchesMaxPrice =
              !hasMaxPriceFilter || housePrice <= formData.maxRangeForHusmodell;
            const matchesBoligtype =
              (!hasTypeFilter || formData.TypeHusmodell.includes(boligtype)) &&
              hasEgenskaper;
            const matchesEgenskaper =
              !hasTypeFilter ||
              egenskaper.some((item: string) =>
                formData.TypeHusmodell.includes(item)
              );

            return (
              matchesBedrooms &&
              matchesMinPrice &&
              matchesMaxPrice &&
              (matchesBoligtype || matchesEgenskaper)
            );
          }) || data;

        setHouseModelProperty(filterData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db, formData, total]);
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
      <div className="relative pt-5 lg:pt-8">
        <SideSpaceContainer>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 md:gap-3 lg:gap-4 mb-6 lg:mb-[40px]">
            <h3 className="text-darkBlack text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Husmodeller</span> i du kan bygge i{" "}
              <span className="font-bold text-blue">{kommune}</span> Kommune
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">{total}</span> annonser
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
                <HusmodellFilterSection
                  formData={formData}
                  setFormData={setFormData}
                  maxRangeData={maxRangeData}
                />
              </div>
            </div>
            <div className="w-full lg:w-[65%]">
              <HusmodellProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
              />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white py-4 md:py-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          }}
        >
          <SideSpaceContainer>
            <div className="flex justify-end items-center gap-6">
              <Button
                text="Tilbake"
                className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
                path="/"
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
          <HusmodellFilterSection
            formData={formData}
            setFormData={setFormData}
            maxRangeData={maxRangeData}
          />
          <div className="absolute top-3 right-2" onClick={toggleDrawer(false)}>
            <X className="h-4 w-4" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default HusmodellPropertyPage;
