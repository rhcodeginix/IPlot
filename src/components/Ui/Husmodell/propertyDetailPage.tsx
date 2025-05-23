import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import Illustrasjoner, {
  formatCurrency,
} from "../RegulationHusmodell/Illustrasjoner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Loader from "@/components/Loader";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import LoginForm from "@/pages/login/loginForm";
import VippsButton from "@/components/vipps";

const PropertyDetailPage: React.FC<any> = ({ handleNext }) => {
  const router = useRouter();
  const id = router.query["husmodellId"];
  const city = router.query["city"];
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
    if (husmodellData?.Leverandører) {
      getData();
    }
  }, [husmodellData?.Leverandører]);

  const [loginPopup, setLoginPopup] = useState(false);
  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}&login_popup=true`);
  };

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

  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <SideSpaceContainer>
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
                            BRA total (bruksareal)
                          </td>
                          <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                            {husmodellData?.BRATotal} m<sup>2</sup>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                            GUA (Gulvareal):
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
                            Lengde
                          </td>
                          <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                            {husmodellData?.Lengde}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                            Bredde
                          </td>
                          <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                            {husmodellData?.Bredde}
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
          {!loginUser && (
            <div
              className="absolute top-0 h-full w-full left-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
              }}
            ></div>
          )}
        </SideSpaceContainer>
      )}
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
                router.push(`/husmodells?Kommue=${city}`);
              }}
            />
            <Button
              text="Gjør tilvalg"
              className="border border-greenBtn bg-greenBtn hover:border-[#28AA6C] focus:border-[#09723F] hover:bg-[#28AA6C] focus:bg-[#09723F] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>

      {isPopupOpen && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <div className="flex justify-center w-full mb-[46px]">
              <Image src={Img_vipps_login} alt="vipps login" />
            </div>
            <h2 className="text-black text-[24px] md:text-[32px] desktop:text-[40px] font-extrabold mb-2 text-center">
              Din <span className="text-primary">Min</span>Tomt-profil
            </h2>
            <p className="text-black text-xs md:text-sm desktop:text-base text-center mb-4">
              Logg inn for å få tilgang til alt{" "}
              <span className="font-bold">MinTomt</span> har å by på.
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({}) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex justify-end">
                      <VippsButton />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-secondary text-sm md:text-base mt-[46px] text-center">
              Når du går videre, aksepterer du <br /> våre vilkår for{" "}
              <a
                className="underline"
                target="__blank"
                href="https://mintomt.no/vilkaar-personvern/brukervilkaar"
              >
                bruk
              </a>{" "}
              og{" "}
              <a
                className="underline"
                target="__blank"
                href="https://mintomt.no/vilkaar-personvern/personvaern"
              >
                personvern
              </a>
            </p>
          </div>
        </div>
      )}

      {loginPopup && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{ zIndex: 9999999 }}
        >
          <LoginForm
            path={`${router.pathname}?${queryString}`}
            setLoginPopup={setLoginPopup}
            setIsCall={setIsCall}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
