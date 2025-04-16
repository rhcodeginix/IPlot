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
import { Formik, Form, Field } from "formik";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import LoginForm from "@/pages/login/loginForm";

const PropertyDetailPage: React.FC<any> = ({ handleNext }) => {
  const router = useRouter();
  const id = router.query["husodellId"];
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
    getData();
  }, [husmodellData?.Leverandører]);

  const [loginPopup, setLoginPopup] = useState(false);
  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const handleLoginCheckboxChange = () => {
    setIsLoginChecked(!isLoginChecked);
  };

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
        className="sticky bottom-0 bg-white py-4 md:py-6"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border-2 border-[#6927DA] text-[#6927DA] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              onClick={() => {
                router.push(`/husmodells?Kommue=${city}`);
              }}
            />
            <Button
              text="Gjør tilvalg"
              className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>

      {isPopupOpen && !loginUser && (
        <div className="fixed top-0 left-0 flex justify-center items-center h-full w-full">
          <div
            className="bg-white p-8 rounded-[8px] w-[787px]"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <h2 className="text-black text-[24px] font-semibold mb-2 text-center">
              Registrer deg
            </h2>
            <p className="text-secondary text-base text-center mb-2">
              Logg inn med{" "}
              <span className="font-semibold text-black">Vipps</span> for å få
              se{" "}
              <span className="font-semibold text-black">
                alle bestemmelser og finne <br />
                boliger som passer på denne eiendommen
              </span>
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <label className="flex items-center gap-[12px] container w-max">
                      <Field
                        type="checkbox"
                        name="terms_condition"
                        checked={isLoginChecked}
                        onChange={() => {
                          setFieldValue(
                            "terms_condition",
                            !values.terms_condition
                          );
                          handleLoginCheckboxChange();
                        }}
                      />
                      <span className="checkmark checkmark_primary"></span>

                      <div className="text-secondary text-base">
                        Jeg aksepterer{" "}
                        <span className="text-primary">Vilkårene</span> og har
                        lest{" "}
                        <span className="text-primary">
                          Personvernerklæringen
                        </span>
                      </div>
                    </label>
                    {errors.terms_condition && touched.terms_condition && (
                      <div className="text-red text-sm">
                        {errors.terms_condition}
                      </div>
                    )}
                    <div className="flex justify-end mt-6">
                      <button
                        className="
                            text-sm md:text-base lg:py-[10px] py-[4px] px-2 md:px-[10px] lg:px-[18px] h-[36px] md:h-[40px] lg:h-[44px] flex items-center gap-[12px] justify-center border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                      >
                        Fortsett med{" "}
                        <Image fetchPriority="auto" src={Ic_vapp} alt="logo" />
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
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
