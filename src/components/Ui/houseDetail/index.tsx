import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Illustrasjoner, {
  formatCurrency,
} from "../RegulationHusmodell/Illustrasjoner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Loader from "@/components/Loader";

const HouseDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.query["husodellId"];
  const getEmbedUrl = (url: string) => {
    const videoId = url?.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&disablekb=1&fs=0`
      : "";
  };
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<any>(null);
  const husmodellData = finalData?.Husdetaljer;
  const [isCall, setIsCall] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [husmodellData?.OmHusmodellen]);
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(id));
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
  }, [id, isCall]);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
      setIsCall(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

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

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <div className="pt-[24px] pb-[86px]">
          <Illustrasjoner />
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
                  className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[130px]"
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
              <h2 className="text-black text-2xl font-semibold mb-4">
                Film av {husmodellData?.husmodell_name}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseDetailPage;
