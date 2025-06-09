import React, { useEffect, useRef, useState } from "react";
import ContactForm from "../stepperUi/contactForm";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import Loader from "@/components/Loader";
import { onAuthStateChanged } from "firebase/auth";
import Illustrasjoner from "./Illustrasjoner";

export function formatCurrency(value: number | string) {
  const number =
    typeof value === "string"
      ? Number(value.replace(/\s/g, "").replace(/kr/i, ""))
      : value;

  if (isNaN(Number(number))) return value;

  const formatted = new Intl.NumberFormat("no-NO", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
  }).format(number);

  return `kr ${formatted}`;
}

const PropertyDetailPage: React.FC<{
  handleNext: any;
  handlePrevious: any;
  id: string;
}> = ({ handleNext, handlePrevious, id }) => {
  const getEmbedUrl = (url: string) => {
    const videoId = url?.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&disablekb=1&fs=0`
      : "";
  };
  const router = useRouter();
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<any>(null);
  const husmodellData = finalData?.Husdetaljer;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [husmodellData?.OmHusmodellen]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", id);
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
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

  const [plotId, setPlotId] = useState<string | null>(null);
  const [husmodellId, setHusmodellId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setPlotId(queryParams.get("plotId"));
      setHusmodellId(queryParams.get("husmodellId"));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser(userData);
          } else {
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const [leadId, setLeadId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !husmodellId) {
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");

      try {
        let plotCollectionRef;

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

        let correctPlotId = null;
        const allLeads = allLeadsSnapshot.docs.map((doc) => {
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

        const plotDocRef = doc(plotCollectionRef, correctPlotId);
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", husmodellId);
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        const finalData = {
          plot: { id: correctPlotId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };
        const leadsCollectionRef = collection(db, "leads");
        const querySnapshot: any = await getDocs(
          query(
            leadsCollectionRef,
            where("finalData.plot.id", "==", correctPlotId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );
        if (!querySnapshot.empty) {
          setLeadId(querySnapshot.docs[0].id);
          router.push(`${router.asPath}&leadId=${querySnapshot.docs[0].id}`);
          queryParams.set("leadId", querySnapshot.docs[0].id);
          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });
          return;
        }

        const docRef: any = await addDoc(leadsCollectionRef, {
          finalData,
          user,
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          IsEmptyPlot: isEmptyPlot === "true",
        });

        queryParams.set("leadId", docRef.id);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
        setLeadId(docRef.id);
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    fetchData();
  }, [plotId, husmodellId, user, leadId]);
  // const [supplierData, setSupplierData] = useState<any>(null);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const supplierDocRef = doc(
  //         db,
  //         "suppliers",
  //         husmodellData?.Leverandører
  //       );
  //       const docSnap: any = await getDoc(supplierDocRef);

  //       if (docSnap.exists()) {
  //         setSupplierData(docSnap.data());
  //       } else {
  //         console.error(
  //           "No document found for ID:",
  //           husmodellData?.Leverandører
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching supplier data:", error);
  //     }
  //   };
  //   if (husmodellData?.Leverandører) {
  //     getData();
  //   }
  // }, [husmodellData?.Leverandører]);

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <SideSpaceContainer>
            <div className="pt-[24px] pb-[86px]">
              <div className="w-full flex gap-[60px]">
                <div className="w-[43%]">
                  <h4 className="text-black mb-6 font-semibold text-2xl">
                    {husmodellData?.husmodell_name}
                  </h4>
                  {/* <div className="relative">
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
                  </div> */}
                  <div className="my-[20px] flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-secondary text-base">Pris fra</p>
                      <h4 className="text-xl font-semibold text-black">
                        {formatCurrency(husmodellData?.pris)}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
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
                  </div>
                  <div className="w-full flex gap-8 mb-[60px]">
                    <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                      <table className="table-auto border-0 w-full text-left property_detail_tbl">
                        <tbody>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              BRA total (bruksareal)
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.BRATotal} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              GUA (Gulvareal):
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.PRom} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Bebygd Areal
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.BebygdAreal} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Lengde
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Lengde}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Bredde
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Bredde}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Soverom
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Soverom}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                      <table className="table-auto border-0 w-full text-left property_detail_tbl">
                        <tbody>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Bad
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Bad}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Innvendig bod
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.InnvendigBod}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Energimerking
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Energimerking}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Tilgjengelig bolig
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.TilgjengeligBolig}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Tomtetype
                            </td>
                            <td className="text-right pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {Array.isArray(husmodellData?.Tomtetype)
                                ? husmodellData.Tomtetype.join(", ")
                                : husmodellData?.Tomtetype}{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <h2 className="mb-6 text-black text-2xl font-semibold">
                    Plantegninger og fasader
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {husmodellData?.PlantegningerFasader &&
                      husmodellData?.PlantegningerFasader?.map(
                        (item: string, index: number) => {
                          return (
                            <img
                              src={item}
                              alt="map"
                              className="w-full"
                              key={index}
                            />
                          );
                        }
                      )}
                  </div>
                </div>
                <div className="w-[57%]">
                  <h2 className="text-black text-2xl font-semibold mb-4">
                    {husmodellData?.Hustittel}
                  </h2>
                  <div className="flex flex-col gap-4 mb-[60px]">
                    <textarea
                      value={husmodellData?.OmHusmodellen}
                      className="text-base text-gray h-full focus-within:outline-none resize-none"
                      ref={textareaRef}
                      readOnly
                    ></textarea>
                  </div>
                  <div className="mb-5 md:mb-[60px]">
                    <Illustrasjoner />
                  </div>
                  <h2 className="text-black text-2xl font-semibold mb-4">
                    {husmodellData?.TittelVideo}
                  </h2>
                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                    }}
                    className="mb-8"
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(husmodellData?.VideoLink)}
                      title={husmodellData?.TittelVideo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <ContactForm leadId={leadId} />
                </div>
              </div>
            </div>
          </SideSpaceContainer>
          <div
            className="sticky bottom-0 bg-white py-4"
            style={{
              boxShadow:
                "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            }}
          >
            <SideSpaceContainer>
              <div className="flex justify-end gap-4 items-center">
                <Button
                  text="Tilbake"
                  className="border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    router.push(router.asPath);
                    handlePrevious();
                  }}
                />
                <Button
                  text="Gjør tilvalg"
                  className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    if (leadId) {
                      router.push(router.asPath);
                      handleNext();
                    }
                  }}
                />
              </div>
            </SideSpaceContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyDetailPage;
