import SideSpaceContainer from "@/components/common/sideSpace";
import BelopFilterSection from "./belopFilterSection";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import BelopProperty from "./belopProperty";
import { useRouter } from "next/router";
import Button from "@/components/common/button";
import Link from "next/link";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Image from "next/image";
import { Settings2, X } from "lucide-react";
import { Drawer } from "@mui/material";
import Loading from "@/components/Loading";

const Belop: React.FC = () => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Hustype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForPlot: 0,
    maxRangeForPlot: 5000000,
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: 5000000,
    Område: [] as string[],
    SubOmråde: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlots = HouseModelProperty.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const queryPrice = queryParams.get("pris");
    const maxRangePlot = queryParams.get("maxRangePlot");
    const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");
    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : Number(queryPrice) * 0.2,
      maxRangeForHusmodell: maxRangeHusmodell
        ? Number(maxRangeHusmodell)
        : Number(queryPrice) * 0.8,
    }));
  }, []);

  // useEffect(() => {
  //   const fetchProperty = async () => {
  //     setIsLoading(true);
  //     try {
  //       const queryParams = new URLSearchParams(window.location.search);

  //       const db = getFirestore();
  //       const citiesCollectionRef = collection(db, "cities");
  //       const queryPrice = queryParams.get("pris");

  //       const cityFormLocalStorage = JSON.parse(
  //         localStorage.getItem("city") || "[]"
  //       );
  //       const subCityFormLocalStorage = JSON.parse(
  //         localStorage.getItem("subcity") || "[]"
  //       );

  //       const citiesSnapshot = await getDocs(citiesCollectionRef);
  //       const fetchedCities = citiesSnapshot.docs.map((doc) => ({
  //         propertyId: doc.id,
  //         ...doc.data(),
  //       }));

  //       const citiesToUse =
  //         cityFormLocalStorage.length > 0
  //           ? cityFormLocalStorage
  //           : fetchedCities.map((city: any) => city.name);

  //       setFormData((prev) => ({
  //         ...prev,
  //         Område: citiesToUse,
  //         SubOmråde:
  //           subCityFormLocalStorage.length > 0 ? subCityFormLocalStorage : [],
  //       }));

  //       const soveromFormLocalStorage = JSON.parse(
  //         localStorage.getItem("soverom") || "[]"
  //       );
  //       const soveromValues = soveromFormLocalStorage.map((item: any) =>
  //         parseInt(item.replace(" Soverom", ""), 10)
  //       );
  //       const HustypeFormLocalStorage = JSON.parse(
  //         localStorage.getItem("Hustype") || "[]"
  //       );
  //       const TypeHusmodellFormLocalStorage = JSON.parse(
  //         localStorage.getItem("TypeHusmodell") || "[]"
  //       );

  //       setFormData((prev) => ({
  //         ...prev,
  //         AntallSoverom: soveromFormLocalStorage,
  //         Hustype: HustypeFormLocalStorage,
  //         TypeHusmodell: TypeHusmodellFormLocalStorage,
  //       }));

  //       const maxRangePlot: any = queryParams.get("maxRangePlot");
  //       const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");

  //       // const citiesSnapshot = await getDocs(citiesCollectionRef);
  //       // const fetchedCities = citiesSnapshot.docs.map((doc) => ({
  //       //   propertyId: doc.id,
  //       //   ...doc.data(),
  //       // }));

  //       const matchedCities = fetchedCities.filter((property: any) =>
  //         citiesToUse.includes(property.name)
  //       );

  //       if (!matchedCities.length) {
  //         setHouseModelProperty([]);
  //         return;
  //       }

  //       // const kommuneNumbers = matchedCities
  //       //   .flatMap((property: any) =>
  //       //     Object.values(property?.kommunenummer).map((value: any) =>
  //       //       parseInt(
  //       //         (typeof value === "string"
  //       //           ? value.replace(/"/g, "")
  //       //           : value
  //       //         ).toString(),
  //       //         10
  //       //       )
  //       //     )
  //       //   )
  //       //   .filter((num) => !isNaN(num));

  //       let kommuneNumbers: number[] = [];

  //       if (subCityFormLocalStorage.length > 0) {
  //         kommuneNumbers = matchedCities
  //           .flatMap((property: any) => {
  //             const matchedNumbers = property.kommunerList
  //               .filter((k: any) => subCityFormLocalStorage.includes(k.name))
  //               .map((k: any) => parseInt(k.number, 10));

  //             if (matchedNumbers.length === 0) {
  //               return Object.values(property?.kommunenummer).map(
  //                 (value: any) =>
  //                   parseInt(
  //                     (typeof value === "string"
  //                       ? value.replace(/"/g, "")
  //                       : value
  //                     ).toString(),
  //                     10
  //                   )
  //               );
  //             }

  //             return matchedNumbers;
  //           })
  //           .filter((num) => !isNaN(num));
  //       } else {
  //         kommuneNumbers = matchedCities
  //           .flatMap((property: any) =>
  //             Object.values(property?.kommunenummer).map((value: any) =>
  //               parseInt(
  //                 (typeof value === "string"
  //                   ? value.replace(/"/g, "")
  //                   : value
  //                 ).toString(),
  //                 10
  //               )
  //             )
  //           )
  //           .filter((num) => !isNaN(num));
  //       }

  //       if (!kommuneNumbers.length) {
  //         setHouseModelProperty([]);
  //         return;
  //       }

  //       const husmodellRef = collection(db, "house_model");
  //       const allHusmodell = (await getDocs(husmodellRef)).docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       const filteredHusmodell = queryPrice
  //         ? allHusmodell.filter((plot: any) => {
  //             const price = parseInt(
  //               plot?.Husdetaljer?.pris.replace(/\s/g, ""),
  //               10
  //             );
  //             const maxPrice = maxRangeHusmodell
  //               ? parseInt(maxRangeHusmodell)
  //               : parseInt(queryPrice.replace(/\s/g, ""), 10) * 0.2;

  //             const boligtype = plot?.Husdetaljer?.VelgBoligtype;
  //             const egenskaper =
  //               plot?.Husdetaljer?.VelgEgenskaperBoligtype || [];
  //             const hasTypeFilter = formData.TypeHusmodell.length > 0;
  //             const hasEgenskaper = egenskaper.length > 0;

  //             const matchesBoligtype =
  //               (!hasTypeFilter ||
  //                 formData.TypeHusmodell.includes(boligtype)) &&
  //               hasEgenskaper;
  //             const matchesEgenskaper =
  //               !hasTypeFilter ||
  //               egenskaper.some((item: string) =>
  //                 formData.TypeHusmodell.includes(item)
  //               );

  //             return (
  //               price <= maxPrice &&
  //               (soveromValues.length > 0
  //                 ? soveromValues.includes(plot?.Husdetaljer?.Soverom)
  //                 : true) &&
  //               (HustypeFormLocalStorage.length > 0
  //                 ? HustypeFormLocalStorage.map((item: any) =>
  //                     item.toLowerCase()
  //                   ).includes(plot?.Husdetaljer?.TypeObjekt?.toLowerCase())
  //                 : true) &&
  //               (matchesBoligtype || matchesEgenskaper)
  //             );
  //           })
  //         : allHusmodell;

  //       const plotsRef = collection(db, "empty_plot");
  //       const allPlots: any = [];
  //       const chunkSize = 10;

  //       for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
  //         const chunk = kommuneNumbers.slice(i, i + chunkSize);
  //         const q = query(
  //           plotsRef,
  //           where(
  //             "lamdaDataFromApi.searchParameters.kommunenummer",
  //             "in",
  //             chunk
  //           )
  //         );
  //         const querySnapshot = await getDocs(q);
  //         querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           if (data?.CadastreDataFromApi?.presentationAddressApi)
  //             allPlots.push({ id: doc.id, ...data });
  //         });
  //       }

  //       const filteredPlots = queryPrice
  //         ? allPlots.filter(
  //             (plot: any) =>
  //               plot.pris <=
  //               (maxRangePlot && parseInt(maxRangePlot, 10)
  //                 ? Number(maxRangePlot)
  //                 : parseInt(queryPrice, 10) *8)
  //           )
  //         : allPlots;

  //       const combinedData = filteredPlots.flatMap((plot: any) =>
  //         filteredHusmodell.map((house) => ({ plot, house }))
  //       );

  //       setHouseModelProperty(combinedData);
  //     } catch (error) {
  //       console.error("Error fetching properties:", error);
  //       setHouseModelProperty([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProperty();
  // }, [router.asPath]);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const db = getFirestore();

        const queryPrice = queryParams.get("pris");
        const maxRangePlot = queryParams.get("maxRangePlot");
        const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");

        const [
          cityFormLocalStorage,
          subCityFormLocalStorage,
          soveromFormLocalStorage,
          HustypeFormLocalStorage,
          TypeHusmodellFormLocalStorage,
        ] = [
          JSON.parse(localStorage.getItem("city") || "[]"),
          JSON.parse(localStorage.getItem("subcity") || "[]"),
          JSON.parse(localStorage.getItem("soverom") || "[]"),
          JSON.parse(localStorage.getItem("Hustype") || "[]"),
          JSON.parse(localStorage.getItem("TypeHusmodell") || "[]"),
        ];

        const soveromValues = soveromFormLocalStorage.map((item: string) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );

        const citiesSnapshot = await getDocs(collection(db, "cities"));
        const fetchedCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const citiesToUse =
          cityFormLocalStorage.length > 0
            ? cityFormLocalStorage
            : fetchedCities.map((city: any) => city.name);

        const matchedCities = fetchedCities.filter((property: any) =>
          citiesToUse.includes(property.name)
        );

        setFormData((prev) => ({
          ...prev,
          Område: cityFormLocalStorage || 0,
          SubOmråde: subCityFormLocalStorage,
          AntallSoverom: soveromFormLocalStorage,
          Hustype: HustypeFormLocalStorage,
          TypeHusmodell: TypeHusmodellFormLocalStorage,
        }));

        if (!matchedCities.length) {
          setHouseModelProperty([]);
          return;
        }

        let kommuneNumbers: number[] = [];

        if (subCityFormLocalStorage.length > 0) {
          matchedCities.forEach((property: any) => {
            const matched = property.kommunerList?.filter((k: any) =>
              subCityFormLocalStorage.includes(k.name)
            );
            if (matched?.length) {
              kommuneNumbers.push(
                ...matched.map((k: any) => parseInt(k.number, 10))
              );
            } else {
              kommuneNumbers.push(
                ...Object.values(property?.kommunenummer || {}).map(
                  (val: any) =>
                    parseInt(
                      (typeof val === "string"
                        ? val.replace(/"/g, "")
                        : val
                      ).toString(),
                      10
                    )
                )
              );
            }
          });
        } else {
          kommuneNumbers = matchedCities.flatMap((property: any) =>
            Object.values(property?.kommunenummer || {}).map((val: any) =>
              parseInt(
                (typeof val === "string"
                  ? val.replace(/"/g, "")
                  : val
                ).toString(),
                10
              )
            )
          );
        }

        kommuneNumbers = kommuneNumbers.filter((num) => !isNaN(num));
        if (!kommuneNumbers.length) {
          setHouseModelProperty([]);
          return;
        }

        const husmodellPromise = getDocs(collection(db, "house_model"));
        const plotChunks = [];

        const chunkSize = 10;

        for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
          const chunk = kommuneNumbers.slice(i, i + chunkSize);

          const shouldLimitResults =
            cityFormLocalStorage.length === 0 &&
            subCityFormLocalStorage.length === 0 &&
            soveromFormLocalStorage.length === 0 &&
            HustypeFormLocalStorage.length === 0 &&
            TypeHusmodellFormLocalStorage.length === 0 &&
            !maxRangePlot &&
            !maxRangeHusmodell;

          const constraints: any = [
            where(
              "lamdaDataFromApi.searchParameters.kommunenummer",
              "in",
              chunk
            ),
          ];

          if (shouldLimitResults) {
            constraints.push(limit(20));
          }

          const q = query(collection(db, "empty_plot"), ...constraints);
          plotChunks.push(getDocs(q));
        }

        const [husmodellSnapshot, ...plotSnapshots] = await Promise.all([
          husmodellPromise,
          ...plotChunks,
        ]);

        const allHusmodell = husmodellSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allPlots = plotSnapshots.flatMap((snapshot) =>
          snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (data: any) => data?.CadastreDataFromApi?.presentationAddressApi
            )
        );

        const filteredHusmodell = queryPrice
          ? allHusmodell.filter((plot: any) => {
              const price = parseInt(
                plot?.Husdetaljer?.pris.replace(/\s/g, ""),
                10
              );
              const maxPrice = maxRangeHusmodell
                ? parseInt(maxRangeHusmodell)
                : parseInt(queryPrice.replace(/\s/g, ""), 10) * 0.8;

              const boligtype = plot?.Husdetaljer?.VelgBoligtype;
              const egenskaper =
                plot?.Husdetaljer?.VelgEgenskaperBoligtype || [];
              const hasTypeFilter = formData.TypeHusmodell.length > 0;
              const hasEgenskaper = egenskaper.length > 0;

              const matchesBoligtype =
                (!hasTypeFilter ||
                  formData.TypeHusmodell.includes(boligtype)) &&
                hasEgenskaper;
              const matchesEgenskaper =
                !hasTypeFilter ||
                egenskaper.some((item: string) =>
                  formData.TypeHusmodell.includes(item)
                );

              return (
                price <= maxPrice &&
                (soveromValues.length > 0
                  ? soveromValues.includes(plot?.Husdetaljer?.Soverom)
                  : true) &&
                (HustypeFormLocalStorage.length > 0
                  ? HustypeFormLocalStorage.map((item: any) =>
                      item.toLowerCase()
                    ).includes(plot?.Husdetaljer?.TypeObjekt?.toLowerCase())
                  : true) &&
                (matchesBoligtype || matchesEgenskaper)
              );
            })
          : allHusmodell;

        const filteredPlots = queryPrice
          ? allPlots.filter(
              (plot: any) =>
                plot.pris <=
                (maxRangePlot
                  ? parseInt(maxRangePlot, 10)
                  : parseInt(queryPrice, 10) * 2)
            )
          : allPlots;

        const combinedData: any = filteredPlots.flatMap((plot: any) =>
          filteredHusmodell.map((house) => ({ plot, house }))
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
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center gap-1">
            <Link
              href={"/"}
              className="text-[#7839EE] text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Start med tomt og husmodell
            </span>
          </div>
        </SideSpaceContainer>
      </div>
      <div className="relative pt-5">
        <SideSpaceContainer>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 md:gap-3 lg:gap-4 mb-6 lg:mb-[40px]">
            <h3 className="text-darkBlack text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              Kombinasjoner av <span className="font-bold">husmodell</span> og{" "}
              <span className="font-bold">tomt</span>{" "}
              {formData?.Område.length > 1 ? null : (
                <>
                  i{" "}
                  <span className="font-bold text-blue">
                    {formData?.Område[0]}
                  </span>
                </>
              )}
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">2 206</span> Tomter
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
                <BelopFilterSection
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
                <BelopProperty
                  HouseModelProperty={currentPlots}
                  isLoading={isLoading}
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
          className="sticky bottom-0 bg-white p-4 md:p-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            zIndex: 999999,
          }}
        >
          <div className="flex justify-end items-center gap-6">
            <Button
              text="Tilbake"
              className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
              onClick={() => router.push("/")}
            />
          </div>
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
          <BelopFilterSection formData={formData} setFormData={setFormData} />
          <div className="absolute top-3 right-2" onClick={toggleDrawer(false)}>
            <X className="h-4 w-4" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Belop;
