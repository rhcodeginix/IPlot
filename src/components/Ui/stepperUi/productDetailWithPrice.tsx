import React, { useEffect, useState } from "react";
import Image from "next/image";
import Ic_productDetailWithPrice from "@/public/images/Ic_productDetailWithPrice.svg";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Loader from "@/components/Loader";
import { formatCurrency } from "../RegulationHusmodell/Illustrasjoner";

export function addDaysToDate(dateString: any, days: any) {
  let date = new Date(dateString);
  date.setDate(date.getDate() + days);

  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const PropertyDetailWithPrice: React.FC<any> = () => {
  const router = useRouter();
  const id = router.query["husmodellId"];

  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const isEmptyPlot = queryParams.get("empty");
        const plotId = queryParams.get("plotId");

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
          plotCollectionRef = doc(db, "empty_plot", String(plotId));
        }

        let plotDocSnap;
        if (isEmptyPlot && !plotId) {
          const plotDocRef = doc(plotCollectionRef, correctPlotId);
          plotDocSnap = await getDoc(plotDocRef);
        } else {
          plotDocSnap = await getDoc(plotCollectionRef);
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
  const plotData = finalData?.plot;

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
    if (husmodellData?.Leverandører) {
      getData();
    }
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

  const total =
    Number(husmodellData?.pris?.replace(/\s/g, "")) +
    Number(plotData?.pris || 0);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          className="bg-white py-[20px] relative p-6 flex items-center gap-6 rounded-[8px]"
          style={{ boxShadow: "0px 4px 16px 0px #0000001A" }}
        >
          <div className="relative w-[42%]">
            <img
              src={husmodellData?.photo}
              alt="image"
              className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
            />
            <img
              src={supplierData?.photo}
              alt="image"
              className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[130px]"
            />
          </div>
          <div className="w-[58%]">
            <h5 className="text-black text-lg font-medium mb-2">
              {husmodellData?.Hustittel}
            </h5>
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
            </div>
            <div className="flex items-center gap-9 my-5">
              <div className="flex flex-col gap-1 w-max">
                <p className="text-secondary text-sm whitespace-nowrap">
                  ESTIMERT BYGGESTART
                </p>
                <h5 className="text-black text-xl font-semibold whitespace-nowrap">
                  {addDaysToDate(
                    finalData?.husmodell?.createdAt,
                    husmodellData?.appSubmitApprove
                  )}
                </h5>
              </div>
              <div className="w-full">
                <Image
                  fetchPriority="auto"
                  src={Ic_productDetailWithPrice}
                  alt="image"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-1 w-max">
                <p className="text-secondary text-sm whitespace-nowrap">
                  ESTIMERT INNFLYTTING
                </p>
                <h5 className="text-black text-xl font-semibold text-right whitespace-nowrap">
                  {addDaysToDate(finalData?.husmodell?.createdAt, totalDays)}
                </h5>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-lightPurple p-3 rounded-b-[12px]">
                <p className="text-base text-secondary text-center">
                  Tilbudpris
                </p>
                <h3 className="text-black font-semibold text-[24px] text-center">
                  kr 8 300 000
                </h3>
                <div className="text-secondary text-base text-center">
                  Tilbudet er gyldig til{" "}
                  <span className="font-semibold text-black">01.12.2024</span>
                </div>
              </div>
              <div className="bg-lightPurple p-3 rounded-b-[12px]">
                <p className="text-base text-secondary text-center">
                  Totalpris med tomt
                </p>
                <h3 className="text-black font-semibold text-[24px] text-center">
                  {formatCurrency(total)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetailWithPrice;
