import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loader from "@/components/Loader";
import { formatCurrency } from "../RegulationHusmodell/Illustrasjoner";
import GoogleMapComponent from "../map";
import { formatPrice } from "@/pages/belop/belopProperty";

export function addDaysToDate(dateString: any, days: any) {
  let date = new Date(dateString);
  date.setDate(date.getDate() + days);

  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const Tilbudsdetaljer: React.FC<{ isRemove?: any }> = ({ isRemove }) => {
  const router = useRouter();
  const id = router.query["husodellId"];

  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const isEmptyPlot = queryParams.get("empty");
        const plotId = queryParams.get("plotId")
          ? queryParams.get("plotId")
          : queryParams.get("propertyId");
        const isNumericPlotId = plotId && /^\d+$/.test(plotId);

        let plotCollectionRef: any;
        let correctPlotId = null;

        if (isEmptyPlot && !plotId) {
          if (isEmptyPlot === "true") {
            plotCollectionRef = collection(db, "empty_plot");
          } else {
            plotCollectionRef = collection(db, "plot_building");
          }

          const allLeadsQuery = query(plotCollectionRef);
          const allLeadsSnapshot = await getDocs(allLeadsQuery);

          if (allLeadsSnapshot.empty) {
            console.warn("No leads found in the collection.");
            return;
          }

          const allLeads = allLeadsSnapshot.docs.map((doc: any) => {
            return { propertyId: doc.id, ...doc.data() };
          });
          for (const lead of allLeads) {
            if (lead?.propertyId) {
              correctPlotId = lead.propertyId;
              break;
            }
          }

          if (!correctPlotId) {
            console.error("No valid plotId found in lamdaData.");
            return;
          }
        } else {
          if (isNumericPlotId) {
            plotCollectionRef = collection(db, "empty_plot");

            const allLeadsQuery = query(plotCollectionRef);
            const allLeadsSnapshot = await getDocs(allLeadsQuery);

            if (allLeadsSnapshot.empty) {
              console.warn("No leads found in the collection.");
              return;
            }

            const allLeads = allLeadsSnapshot.docs.map((doc: any) => {
              return { propertyId: doc.id, ...doc.data() };
            });
            for (const lead of allLeads) {
              if (lead?.propertyId) {
                correctPlotId = lead.propertyId;
                break;
              }
            }

            if (!correctPlotId) {
              console.error("No valid plotId found in lamdaData.");
              return;
            }
          } else {
            plotCollectionRef = doc(db, "empty_plot", String(plotId));
          }
        }

        let plotDocSnap;
        if (isEmptyPlot && !plotId) {
          const plotDocRef = doc(plotCollectionRef, correctPlotId);
          plotDocSnap = await getDoc(plotDocRef);
        } else {
          if (isNumericPlotId) {
            const plotDocRef = doc(plotCollectionRef, correctPlotId);
            plotDocSnap = await getDoc(plotDocRef);
          } else {
            plotDocSnap = await getDoc(plotCollectionRef);
          }
        }

        const husmodellDocRef = doc(db, "house_model", String(id));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (plotDocSnap.exists() && husmodellDocSnap.exists()) {
          let plotData: any = plotDocSnap.data();
          let husmodellData = husmodellDocSnap.data();
          setFinalData({
            plot: { id: correctPlotId, ...plotData },
            husmodell: { id: id, ...husmodellData },
          });
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const husmodellData = finalData?.husmodell?.Husdetaljer;

  const [supplierData, setSupplierData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const supplierDocRef = doc(
          db,
          "suppliers",
          husmodellData?.Leverandører
        );
        const docSnap: any = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplierData(docSnap.data());
        } else {
          console.error(
            "No document found for ID:",
            husmodellData?.Leverandører
          );
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    getData();
  }, [husmodellData?.Leverandører]);

  const totalDays = [
    husmodellData?.signConractConstructionDrawing +
      husmodellData?.neighborNotification +
      husmodellData?.appSubmitApprove +
      husmodellData?.constuctionDayStart +
      husmodellData?.foundationWork +
      husmodellData?.concreteWork +
      husmodellData?.deliveryconstuctionKit +
      husmodellData?.denseConstuction +
      husmodellData?.completeInside +
      husmodellData?.preliminaryInspection +
      husmodellData?.takeOver,
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const [custHouse, setCusHouse] = useState<any>(null);
  useEffect(() => {
    const customizeHouse = localStorage.getItem("customizeHouse");
    if (customizeHouse) {
      setCusHouse(JSON.parse(customizeHouse));
    }
  }, []);

  const totalCustPris = custHouse?.reduce(
    (sum: any, item: any) =>
      sum + Number(item?.product?.pris.replace(/\s/g, "")),
    0
  );
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="border border-[#DCDFEA] relative p-3 md:p-5 rounded-[8px]">
          <div className="flex items-center gap-2 md:gap-3 justify-between mb-2 md:mb-4">
            <h4 className="text-darkBlack text-sm md:text-base lg:text-lg one_line_elipse">
              <span className="font-semibold">
                {husmodellData?.husmodell_name}
              </span>{" "}
              bygget i{" "}
              {
                finalData?.plot?.CadastreDataFromApi?.presentationAddressApi
                  ?.response?.item?.formatted?.line1
              }{" "}
              <span className="text-secondary2">
                (
                {
                  finalData?.plot?.CadastreDataFromApi?.presentationAddressApi
                    ?.response?.item?.street?.municipality?.municipalityName
                }
                )
              </span>
            </h4>
            <p className="text-secondary2 text-xs md:text-sm whitespace-nowrap">
              {
                finalData?.plot?.CadastreDataFromApi?.presentationAddressApi
                  ?.response?.item?.formatted?.line2
              }
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 desktop:gap-6">
            <div className="relative w-full lg:w-[37%] flex gap-2 h-[200px] md:h-[262px]">
              <div className="w-1/2 sm:w-[63%] relative h-full">
                <img
                  src={husmodellData?.photo}
                  alt="image"
                  className="w-full h-full object-cover rounded-[12px] overflow-hidden"
                />
                <img
                  src={supplierData?.photo}
                  alt="image"
                  className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[100px] sm:w-[130px]"
                />
              </div>
              <div className="w-1/2 sm:w-[37%] rounded-[8px] h-full overflow-hidden">
                <GoogleMapComponent
                  coordinates={
                    finalData?.plot?.lamdaDataFromApi?.coordinates
                      ?.convertedCoordinates
                  }
                />
              </div>
            </div>
            <div className="w-full lg:w-[63%]">
              <div className="flex items-center gap-3">
                <div className="text-secondary text-sm">
                  <span className="text-black font-semibold">
                    {husmodellData?.BRATotal}
                  </span>{" "}
                  m<sup>2</sup>
                </div>
                <div className="h-[12px] w-[1px] border-l border-gray"></div>
                <div className="text-secondary text-sm">
                  <span className="text-black font-semibold">
                    {husmodellData?.Soverom}
                  </span>{" "}
                  soverom
                </div>
                <div className="h-[12px] w-[1px] border-l border-gray"></div>
                <div className="text-secondary text-sm">
                  <span className="text-black font-semibold">
                    {husmodellData?.Bad}
                  </span>{" "}
                  bad
                </div>
                <div className="text-darkBlack text-xs md:text-sm font-semibold ml-auto">
                  {
                    finalData?.plot?.additionalData?.answer?.bya_calculations
                      ?.input?.plot_size
                  }{" "}
                  <span className="text-[#4A5578] font-normal">m²</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row lg:flex-col desktop:flex-row gap-2 md:gap-4 desktop:gap-8 my-3 md:my-5">
                <div className="w-full flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                      Pris for{" "}
                      <span className="font-semibold">
                        {husmodellData?.husmodell_name}
                      </span>
                    </p>
                    <h6 className="text-xs md:text-base font-semibold">
                      {formatCurrency(
                        (
                          totalCustPris +
                          Number(husmodellData?.pris?.replace(/\s/g, ""))
                        ).toLocaleString("nb-NO")
                      )}
                    </h6>
                  </div>
                  {isRemove ? null : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm whitespace-nowrap">
                          Estimert byggestart
                        </p>
                        <h5 className="text-black text-sm font-semibold whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            husmodellData?.appSubmitApprove
                          )}
                        </h5>
                      </div>
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm whitespace-nowrap">
                          Estimert Innflytting
                        </p>
                        <h5 className="text-black text-sm font-semibold text-right whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            totalDays
                          )}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-l border-[#DCDFEA] hidden sm:block lg:hidden desktop:block"></div>
                <div className="w-full flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                      Pris for <span className="font-semibold">Tomt</span>
                    </p>
                    <h6 className="text-xs md:text-base font-semibold">
                      {finalData?.plot?.pris
                        ? formatPrice(
                            finalData?.plot?.pris.toLocaleString("nb-NO")
                          )
                        : "0 NOK"}
                    </h6>
                  </div>
                  {isRemove ? null : (
                    <div className="flex items-center justify-between gap-1 mb-4">
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm">
                          Estimert start kjøpsprosess
                        </p>
                        <h5 className="text-black text-sm font-semibold whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            husmodellData?.appSubmitApprove
                          )}
                        </h5>
                      </div>
                      <div className="flex flex-col gap-1 w-max">
                        <p className="text-secondary text-sm text-right">
                          Estimert overtakelse
                        </p>
                        <h5 className="text-black text-sm font-semibold text-right whitespace-nowrap">
                          {addDaysToDate(
                            finalData?.husmodell?.createdAt,
                            totalDays
                          )}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-[#F5F8FF] p-2 md:p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs md:text-sm text-secondary text-center">
                    Tilbudpris
                  </p>
                  <h3 className="text-black font-semibold text-base md:text-lg desktop:text-xl text-center">
                    {formatCurrency(
                      (
                        totalCustPris +
                        Number(husmodellData?.pris?.replace(/\s/g, "")) +
                        Number(finalData?.plot?.pris || 0)
                      ).toLocaleString("nb-NO")
                    )}
                  </h3>
                </div>
                <div className="text-secondary2 text-xs md:text-sm font-bold">
                  (inkludert tilvalg <span className="font-normal">og</span>{" "}
                  utkjøp av tomt)
                </div>
                <div className="text-secondary text-sm md:text-base text-center">
                  Tilbudet er gyldig til{" "}
                  <span className="font-semibold text-black">01.12.2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tilbudsdetaljer;
