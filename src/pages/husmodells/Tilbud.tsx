import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import { useRouter } from "next/router";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import NorkartMap from "@/components/map";
import { toast } from "react-hot-toast";
import { addDaysToDate } from "@/components/Ui/husmodellPlot/Tilbudsdetaljer";

const Tilbud: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  supplierData: any;
  pris: any;
  user: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  askData,
  CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  supplierData,
  pris,
  user,
}) => {
  const router = useRouter();

  const Huskonfigurator =
    HouseModelData?.Huskonfigurator?.hovedkategorinavn || [];
  const Husdetaljer = HouseModelData?.Husdetaljer;

  // const [user, setUser] = useState<any>(null);
  const { husmodellId, noPlot } = router.query;
  const plotId = router.query["plotId"];
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const husmodellData = finalData?.husmodell?.Husdetaljer;
  useEffect(() => {
    if (!router.query["plotId"]) {
      // router.query;
      router.push(`${router.asPath}&noPlot=true`);
    }
  }, []);

  useEffect(() => {
    // if (!husmodellId || !plotId) return;

    const fetchData = async () => {
      try {
        let plotData = null;

        if (!noPlot && plotId) {
          const plotDocRef = doc(db, "empty_plot", String(plotId));
          const plotDocSnap = await getDoc(plotDocRef);

          if (plotDocSnap.exists()) {
            plotData = { id: plotId, ...plotDocSnap.data() };
          } else {
            console.warn("Plot document does not exist.");
          }
        }

        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          // let plotData = plotDocSnap.data();
          let husmodellData = husmodellDocSnap.data();
          setFinalData({
            plot: plotData,
            husmodell: { id: husmodellId, ...husmodellData },
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

    if (husmodellId && (plotId || noPlot)) {
      fetchData();
    }
  }, [husmodellId, plotId, noPlot]);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !husmodellId) return;

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");

      try {
        const plotDocSnap = await getDoc(doc(db, "empty_plot", String(plotId)));
        const husmodellDocSnap = await getDoc(
          doc(db, "house_model", String(husmodellId))
        );

        const finalData = {
          plot: { id: plotId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };

        const leadsQuerySnapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.husmodell.id", "==", husmodellId),
            where("finalData.plot.id", "==", String(plotId)),
            where("user.id", "==", user.id)
          )
        );

        let leadIdToSet: any = "";

        if (!leadsQuerySnapshot.empty) {
          leadIdToSet = leadsQuerySnapshot.docs[0].id;
          const data = leadsQuerySnapshot.docs[0].data();
          if (data.Isopt === true || data.IsoptForBank === true) {
            const timestamp = leadsQuerySnapshot.docs[0].data().updatedAt;

            const finalDate = new Date(
              timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
            );
            setDate(finalDate);
          }
        } else {
          const docRef = await addDoc(collection(db, "leads"), {
            finalData,
            user,
            Isopt: false,
            IsoptForBank: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            IsEmptyPlot: isEmptyPlot === "true",
          });
          leadIdToSet = docRef.id;
        }

        queryParams.set("leadId", leadIdToSet);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (husmodellId && user && plotId) {
      fetchData();
    }

    const fetchWithoutPlotData = async () => {
      if (!user || !husmodellId) return;

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      const currentLeadId = queryParams.get("leadId");
      queryParams.delete("leadId");

      try {
        const [husmodellDocSnap] = await Promise.all([
          getDoc(doc(db, "house_model", String(husmodellId))),
        ]);

        const finalData = {
          plot: null,
          husmodell: { id: String(husmodellId), ...husmodellDocSnap.data() },
        };

        const leadsQuerySnapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.plot", "==", null),
            where("finalData.husmodell.id", "==", String(husmodellId)),
            where("user.id", "==", user.id)
          )
        );

        if (!leadsQuerySnapshot.empty) {
          const existingLeadId = leadsQuerySnapshot.docs[0].id;
          // await updateDoc(doc(db, "leads", existingLeadId), {
          //   updatedAt: new Date(),
          // });
          if (currentLeadId !== existingLeadId) {
            queryParams.set("leadId", existingLeadId);
            const data = leadsQuerySnapshot.docs[0].data();

            if (data.Isopt === true || data.IsoptForBank === true) {
              const timestamp = leadsQuerySnapshot.docs[0].data().updatedAt;

              const finalDate = new Date(
                timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
              );

              setDate(finalDate);
            }
            router.replace({
              pathname: router.pathname,
              query: Object.fromEntries(queryParams),
            });
          }
          return;
        } else if (currentLeadId) {
          const oldLeadRef = doc(db, "leads", currentLeadId);
          const leadSnapshot = await getDoc(oldLeadRef);
          if (leadSnapshot.exists()) {
            const existingLead = leadSnapshot.data();
            queryParams.set("leadId", currentLeadId);

            if (existingLead.finalData.plot === null) {
              await updateDoc(oldLeadRef, {
                finalData,
                user,
                updatedAt: new Date(),
                IsEmptyPlot: isEmptyPlot === "true",
              });
            }
          }

          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });
          return;
        }
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (!plotId && husmodellId && user) {
      fetchWithoutPlotData();
    }
  }, [husmodellId, user]);

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

  const [updatedArray, setUpdatedArray] = useState([]);

  useEffect(() => {
    if (Huskonfigurator?.length > 0 && custHouse?.length > 0) {
      const mergedArray = Huskonfigurator.map(
        (category: any, catIndex: number) => {
          const matchedSubCategories = category.Kategorinavn.map(
            (subCategory: any, subIndex: number) => {
              const match = custHouse.find(
                (item: any) =>
                  item.category === catIndex && item.subCategory === subIndex
              );

              if (match) {
                return {
                  ...subCategory,
                  produkter: [match.product],
                };
              }

              return null;
            }
          ).filter(Boolean);

          if (matchedSubCategories.length > 0) {
            return {
              ...category,
              Kategorinavn: matchedSubCategories,
            };
          }

          return null;
        }
      ).filter(Boolean);

      setUpdatedArray(mergedArray);
    }
  }, [Huskonfigurator, custHouse]);

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

  const totalByggestartDays = [
    husmodellData?.signConractConstructionDrawing +
      husmodellData?.neighborNotification +
      husmodellData?.appSubmitApprove +
      husmodellData?.constuctionDayStart,
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const leadId = router.query["leadId"];
  const ByggestartDate = addDaysToDate(date, totalByggestartDays);

  return (
    <>
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-[#7839EE] text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Husmodell
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 1;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tilpass
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                handlePrevious();
              }}
            >
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">Tilbud</span>
          </div>
          <PropertyHouseDetails
            CadastreDataFromApi={CadastreDataFromApi}
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            supplierData={supplierData}
            pris={pris}
            loading={loading}
          />
        </SideSpaceContainer>
      </div>
      {!noPlot && (
        <div className="hidden lg:block">
          <PropertyDetails
            askData={askData}
            CadastreDataFromApi={CadastreDataFromApi}
            lamdaDataFromApi={lamdaDataFromApi}
            HouseModelData={HouseModelData}
            loading={loading}
          />
        </div>
      )}
      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <h5 className="text-darkBlack text-base md:text-lg desktop:text-xl font-semibold mb-2 md:mb-4">
            Tilbud
          </h5>
          <div className="flex flex-col desktop:flex-row items-start gap-6">
            <div className="w-full desktop:w-[40%]">
              <div className="border border-[#DCDFEA] rounded-lg p-3 md:p-5">
                {loading ? (
                  <div className="w-[260px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                ) : (
                  <h4 className="text-black text-sm md:text-base lg:text-lg mb-1">
                    <span className="font-semibold">
                      {HouseModelData?.Husdetaljer?.husmodell_name}
                    </span>{" "}
                    {plotId && (
                      <>
                        bygget i{" "}
                        {
                          CadastreDataFromApi?.presentationAddressApi?.response
                            ?.item?.formatted?.line1
                        }{" "}
                        <span className="text-secondary2">
                          (
                          {
                            CadastreDataFromApi?.presentationAddressApi
                              ?.response?.item?.street?.municipality
                              ?.municipalityName
                          }
                          )
                        </span>
                      </>
                    )}
                  </h4>
                )}
                {loading ? (
                  <div className="w-[200px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                ) : (
                  <p className="text-secondary2 text-xs md:text-sm">
                    {
                      CadastreDataFromApi?.presentationAddressApi?.response
                        ?.item?.formatted?.line2
                    }
                  </p>
                )}
                <div
                  className={`flex gap-2 ${plotId && "h-[150px] sm:h-[189px]"} mb-2 md:mb-4`}
                >
                  {loading ? (
                    <div
                      className={`${plotId ? "w-[63%]" : "w-full"} rounded-lg custom-shimmer`}
                    ></div>
                  ) : (
                    <div
                      className={`${plotId ? "w-[63%]" : "w-full"} h-full relative`}
                    >
                      <img
                        src={Husdetaljer?.photo}
                        alt="husmodell"
                        className="w-full h-full rounded-[8px] object-cover"
                      />
                      <img
                        src={supplierData?.photo}
                        alt="product-logo"
                        className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                      />
                    </div>
                  )}
                  {plotId && (
                    <>
                      {loading ? (
                        <div className="w-[37%] h-full rounded-lg custom-shimmer"></div>
                      ) : (
                        <div className="w-[37%] rounded-[8px] overflow-hidden h-full">
                          {/* <GoogleMapComponent
                          coordinates={
                            lamdaDataFromApi?.coordinates?.convertedCoordinates
                          }
                        /> */}
                          {lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates && (
                            <NorkartMap
                              coordinates={
                                lamdaDataFromApi?.coordinates
                                  ?.convertedCoordinates
                              }
                              MAX_ZOOM={20}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <div className="text-darkBlack text-xs md:text-sm font-semibold">
                      {Husdetaljer?.BebygdAreal}{" "}
                      <span className="text-[#4A5578] font-normal">m²</span>
                    </div>
                  )}
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <div className="text-darkBlack text-xs md:text-sm font-semibold">
                      {Husdetaljer?.Soverom}{" "}
                      <span className="text-[#4A5578] font-normal">
                        soverom
                      </span>
                    </div>
                  )}
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <div className="text-darkBlack text-xs md:text-sm font-semibold">
                      {Husdetaljer?.Bad}{" "}
                      <span className="text-[#4A5578] font-normal">bad</span>
                    </div>
                  )}
                  {askData?.bya_calculations?.input?.plot_size && (
                    <>
                      {loading ? (
                        <div className="w-[200px] h-[20px] rounded-lg custom-shimmer ml-auto"></div>
                      ) : (
                        <div className="text-darkBlack text-xs md:text-sm font-semibold ml-auto">
                          {askData?.bya_calculations?.input?.plot_size}{" "}
                          <span className="text-[#4A5578] font-normal">m²</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                      Pris for{" "}
                      <span className="font-semibold">
                        {Husdetaljer?.husmodell_name}
                      </span>
                    </p>
                  )}
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <h6 className="text-xs md:text-base font-semibold desktop:text-lg">
                      {formatCurrency(
                        totalCustPris +
                          Number(Husdetaljer?.pris?.replace(/\s/g, ""))
                      )}
                    </h6>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex flex-col gap-1 w-max">
                    {loading ? (
                      <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <p className="text-secondary text-sm whitespace-nowrap">
                        Estimert byggestart
                      </p>
                    )}
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-black text-sm font-semibold whitespace-nowrap">
                        {ByggestartDate}
                      </h5>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-max">
                    {loading ? (
                      <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <p className="text-secondary text-xs md:text-sm whitespace-nowrap">
                        Estimert Innflytting
                      </p>
                    )}
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h5 className="text-black text-sm font-semibold text-right whitespace-nowrap">
                        {addDaysToDate(date, totalDays)}
                      </h5>
                    )}
                  </div>
                </div>
                <div className="bg-[#F5F8FF] rounded-lg p-3">
                  {loading ? (
                    <div className="w-[180px] h-[20px] rounded-lg custom-shimmer mb-1 mx-auto"></div>
                  ) : (
                    <p className="text-secondary2 text-xs md:text-sm mb-1 text-center">
                      Tilbudpris
                    </p>
                  )}
                  {loading ? (
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer mb-2 mx-auto"></div>
                  ) : (
                    <h4 className="text-center font-semibold text-lg md:text-lg desktop:text-2xl text-black mb-2">
                      {formatCurrency(
                        totalCustPris +
                          Number(Husdetaljer?.pris?.replace(/\s/g, "")) +
                          Number(pris || 0)
                      )}
                    </h4>
                  )}
                  <div className="text-secondary text-sm md:text-base text-center flex justify-center">
                    {loading ? (
                      <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <>Tilbudet gjelder til</>
                    )}{" "}
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <span className="text-[#101828] font-semibold">
                        {new Date(
                          new Date().getFullYear(),
                          11,
                          31
                        ).toLocaleDateString("no-NO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!noPlot && <LeadsBox col={true} />}
            </div>
            <div className="w-full desktop:w-[60%] border border-[#DCDFEA] rounded-lg overflow-hidden">
              {loading ? (
                <div className="w-[200px] h-[20px] rounded-lg custom-shimmer p-3"></div>
              ) : (
                <div className="p-3 md:p-5 border-b w-full border-[#DCDFEA] text-darkBlack text-base md:text-lg lg:text-xl font-semibold">
                  Ditt tilbud på{" "}
                  <span className="text-lg md:text-xl desktop:text-2xl">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  inkluderer
                </div>
              )}
              <div className="p-3 md:p-5 flex flex-col md:flex-row gap-4 lg:gap-8">
                <div className="w-full md:w-[38%] bg-lightPurple2 rounded-lg h-max overflow-hidden">
                  <div className="p-3 md:p-4">
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer mb-2"></div>
                    ) : (
                      <h5 className="text-black font-semibold text-sm md:text-base mb-2 md:mb-[14px]">
                        Prisliste (inkludert MVA)
                      </h5>
                    )}
                    <div className="flex flex-col gap-2 md:gap-3">
                      {updatedArray?.length > 0 ? (
                        <div className="flex flex-col gap-2 md:gap-3">
                          {updatedArray.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="flex-col flex gap-2 md:gap-3"
                            >
                              {item?.Kategorinavn?.map(
                                (cat: any, catIndex: number) => (
                                  <div key={catIndex}>
                                    {cat?.produkter?.map(
                                      (product: any, proIndex: number) => (
                                        <div
                                          key={proIndex}
                                          className="flex gap-2 w-full justify-between"
                                        >
                                          {loading ? (
                                            <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                                          ) : (
                                            <h4 className="text-secondary2 text-xs md:text-sm">
                                              {item?.navn}
                                            </h4>
                                          )}
                                          {loading ? (
                                            <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                                          ) : (
                                            <div className="text-black font-medium text-xs md:text-sm">
                                              {product?.IncludingOffer
                                                ? "Standard"
                                                : formatCurrency(product?.pris)}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-3 text-lg">
                          Ingen tilpasning.
                        </p>
                      )}
                      <div className="w-full border-t border-[#DCDFEA]"></div>
                      <div className="flex gap-2 w-full justify-between">
                        {loading ? (
                          <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <h4 className="text-secondary2 text-xs md:text-sm">
                            Totalt tilpassing
                          </h4>
                        )}
                        {loading ? (
                          <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <div className="text-black font-medium text-xs md:text-sm">
                            {totalCustPris ? formatCurrency(totalCustPris) : 0}
                          </div>
                        )}
                      </div>
                      <div className="w-full border-t border-[#DCDFEA]"></div>
                      <div className="flex gap-2 w-full justify-between">
                        {loading ? (
                          <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <h4 className="text-secondary2 text-xs md:text-sm">
                            Husmodellpris
                          </h4>
                        )}
                        {loading ? (
                          <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <div className="text-black font-medium text-xs md:text-sm">
                            {Husdetaljer
                              ? formatCurrency(Husdetaljer?.pris)
                              : 0}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 w-full justify-between">
                        {loading ? (
                          <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <h4 className="text-secondary2 text-xs md:text-sm">
                            Tomtpris
                          </h4>
                        )}
                        {loading ? (
                          <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                        ) : (
                          <div className="text-black font-medium text-xs md:text-sm">
                            {pris
                              ? pris === 0
                                ? "kr 0"
                                : formatCurrency(pris)
                              : "kr 0"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#ECE9FE] p-3 md:p-4 flex gap-2 w-full justify-between">
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <h4 className="text-secondary2 text-xs md:text-sm">
                        Total
                      </h4>
                    )}
                    {loading ? (
                      <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                    ) : (
                      <div className="text-black font-medium text-xs md:text-sm">
                        {formatCurrency(
                          totalCustPris +
                            Number(Husdetaljer?.pris?.replace(/\s/g, "")) +
                            Number(pris || 0)
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-[62%]">
                  {updatedArray?.length > 0 ? (
                    <div className="flex flex-col gap-4 md:gap-4 lg:gap-6">
                      {updatedArray.map((item: any, index: number) => (
                        <div key={index}>
                          {loading ? (
                            <div className="w-[180px] h-[20px] rounded-lg custom-shimmer mb-2"></div>
                          ) : (
                            <h4 className="text-black font-semibold text-sm md:text-base mb-2 md:mb-3">
                              {item?.navn}
                            </h4>
                          )}
                          <div className="flex flex-col gap-2 md:gap-3">
                            {item?.Kategorinavn?.map(
                              (cat: any, catIndex: number) => (
                                <div key={catIndex}>
                                  {cat?.produkter?.map(
                                    (product: any, proIndex: number) => (
                                      <div
                                        key={proIndex}
                                        className="flex gap-2 md:gap-4 w-full"
                                      >
                                        <div className="w-[57px] h-[40px] rounded-[4px] overflow-hidden">
                                          {loading ? (
                                            <div className="w-full h-full rounded-lg custom-shimmer"></div>
                                          ) : (
                                            <img
                                              src={product?.Hovedbilde?.[0]}
                                              alt="image"
                                              className="w-full h-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2 w-full">
                                          <div>
                                            {loading ? (
                                              <div className="w-[180px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                                            ) : (
                                              <h5 className="text-black text-xs md:text-sm font-medium">
                                                {cat?.navn}
                                              </h5>
                                            )}
                                            {loading ? (
                                              <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                                            ) : (
                                              <p className="text-secondary2 text-xs md:text-sm">
                                                {product?.Produktnavn}
                                              </p>
                                            )}
                                          </div>
                                          {loading ? (
                                            <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                                          ) : (
                                            <div className="text-black font-semibold text-xs md:text-sm">
                                              {product?.IncludingOffer
                                                ? "Standard"
                                                : formatCurrency(product?.pris)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-3 text-lg">
                      Du har ikke noe alternativ.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
      <div
        className="sticky bottom-0 bg-white py-4"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <p className="text-sm md:text-base font-light">
              En innsending er{" "}
              <span className="font-medium">uforpliktende</span> og du vil bli{" "}
              <br className="hidden md:block" />
              <span className="font-medium">
                kontaktet av en hyttekonsulent
              </span>
            </p>
            <div className="flex flex-row gap-4 sm:items-center">
              <Button
                text="Tilbake"
                className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                onClick={() => {
                  handlePrevious();
                }}
              />
              <Button
                text="Send til Fjellheimhytta"
                className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={async () => {
                  handleNext();
                  try {
                    if (leadId) {
                      await updateDoc(doc(db, "leads", String(leadId)), {
                        IsoptForBank: true,
                        updatedAt: new Date(),
                        Isopt: true,
                        EstimertByggestart: ByggestartDate,
                        EstimertInnflytting: addDaysToDate(date, totalDays),
                      });
                      toast.success("Lead sendt.", {
                        position: "top-right",
                      });
                    } else {
                      toast.error("Lead id not found.", {
                        position: "top-right",
                      });
                    }
                  } catch (error) {
                    console.error("Firestore update operation failed:", error);
                  }
                }}
              />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Tilbud;
