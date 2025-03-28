import React, { useEffect, useRef, useState } from "react";
import Img_product_3d_img1 from "@/public/images/Img_product_3d_img1.png";
import Image from "next/image";
import ContactForm from "../stepperUi/contactForm";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import Ic_close from "@/public/images/Ic_close.svg";
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
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Modal from "@/components/common/modal";
import Loader from "@/components/Loader";
import { onAuthStateChanged } from "firebase/auth";

export function formatCurrency(nokValue: any) {
  let number = nokValue.replace(/\s/g, "");
  return new Intl.NumberFormat("de-DE").format(Number(number)) + " NOK";
}

const PropertyDetailPage: React.FC<{
  handleNext: any;
  handlePrevious: any;
  id: string;
}> = ({ handleNext, handlePrevious, id }) => {
  const getEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
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

  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const images = finalData?.Husdetaljer?.photo3D || [];

  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - 4;

  const handlePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(true);
    }
  };

  const [plotId, setPlotId] = useState<string | null>(null);
  const [husmodellId, setHusmodellId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setPlotId(queryParams.get("plotId"));
      setHusmodellId(queryParams.get("husodellId"));
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
          return;
        }

        const docRef: any = await addDoc(leadsCollectionRef, {
          finalData,
          user,
          Isopt: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          IsEmptyPlot: isEmptyPlot === "true",
        });

        setLeadId(docRef.id);
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    fetchData();
  }, [plotId, husmodellId, user]);
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

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <SideSpaceContainer>
            <div className="pt-[24px] pb-[86px]">
              <div style={{ borderBottom: "1px solid #B9C0D4" }}>
                <button
                  className={`bg-white flex justify-between items-center w-full pb-6 duration-1000 ${isOpen ? "active" : ""}`}
                  onClick={toggleAccordion}
                >
                  <span className="text-black text-lg font-semibold">
                    Illustrasjoner
                  </span>
                  {isOpen ? (
                    <Image
                      src={Ic_chevron_up}
                      alt="arrow"
                      fetchPriority="auto"
                    />
                  ) : (
                    <Image
                      src={Ic_chevron_down}
                      alt="arrow"
                      fetchPriority="auto"
                    />
                  )}
                </button>
                <div
                  className={`overflow-hidden max-h-0 ${isOpen ? "pb-6" : ""}`}
                  style={{
                    maxHeight: isOpen ? "max-content" : "0",
                    transition: "max-height 0.2s ease-out",
                  }}
                >
                  <div className="gap-6 flex h-[400px]">
                    <div className="w-1/2">
                      <Image
                        src={Img_product_3d_img1}
                        alt="product"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-1/2 grid grid-cols-2 gap-6">
                      {displayedImages.map((image: any, index: number) => (
                        <div
                          key={index}
                          className="relative overflow-hidden h-full"
                        >
                          <img
                            src={image}
                            alt="product"
                            className="w-full h-full object-fill rounded-lg"
                          />

                          {index === 3 && extraImagesCount > 0 && (
                            <div
                              className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg"
                              onClick={handlePopup}
                            >
                              +{extraImagesCount}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-[60px] mt-8">
                <div className="w-[43%]">
                  <h4 className="text-black mb-6 font-semibold text-2xl">
                    {husmodellData?.husmodell_name}
                  </h4>
                  <div className="relative">
                    <img
                      src={husmodellData?.photo}
                      alt="image"
                      className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
                    />
                    <img
                      src={supplierData?.photo}
                      alt="image"
                      className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-auto"
                    />
                  </div>
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
                              BRA total
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.BRATotal} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              BRA bolig
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.BebygdAreal} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              P-rom:
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.PRom} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Bebygd Areal
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.BebygdAreal} m<sup>2</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              L x B:
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.LB}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Soverom
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
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
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Bad}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Innvendig bod
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.InnvendigBod}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Energimerking
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Energimerking}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Tilgjengelig bolig
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.TilgjengeligBolig}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                              Tomtetype
                            </td>
                            <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                              {husmodellData?.Tomtetype}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <h2 className="mb-6 text-black text-2xl font-semibold">
                    Plantegninger og fasader
                  </h2>
                  <img
                    src={husmodellData?.PlantegningerFasader[0]}
                    alt="map"
                    className="w-full"
                  />
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
            className="sticky bottom-0 bg-white py-6"
            style={{
              boxShadow:
                "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            }}
          >
            <SideSpaceContainer>
              <div className="flex justify-end gap-4 items-center">
                <Button
                  text="Tilbake"
                  className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    handlePrevious();
                    router.push(router.asPath);
                  }}
                />
                <Button
                  text="Gjør tilvalg"
                  className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    router.push(router.asPath);
                    handleNext();
                  }}
                />
              </div>
            </SideSpaceContainer>
          </div>
        </>
      )}
      {isPopupOpen && (
        <Modal isOpen={true} onClose={handlePopup}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            <div className="grid grid-cols-3 gap-2 my-4">
              {images.map((image: any, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt="product"
                  className="w-full h-[200px]"
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PropertyDetailPage;
