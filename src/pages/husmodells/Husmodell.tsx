import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HusmodellPropertyPage from "../husmodell";
import HusmodellDetail from "./husmodell-details";
import * as Yup from "yup";
import Image from "next/image";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import { Formik, Form } from "formik";
import LoginForm from "../login/loginForm";
import VippsButton from "@/components/vipps";

const Husmodell: React.FC<any> = ({
  handleNext,
  loading,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  HouseModelData,
  pris,
  lamdaDataFromApi,
  supplierData,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { husmodellId } = router.query;

  const [loginPopup, setLoginPopup] = useState(false);

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  // const [isLoginChecked, setIsLoginChecked] = useState(false);
  // const handleLoginCheckboxChange = () => {
  //   setIsLoginChecked(!isLoginChecked);
  // };

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

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      {!husmodellId ? (
        <HusmodellPropertyPage />
      ) : (
        <HusmodellDetail
          handleNext={handleNext}
          HouseModelData={HouseModelData}
          loading={loading}
          pris={pris}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
        />
      )}

      {!loginUser && (
        <div
          className="absolute top-0 h-full w-full left-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
          }}
        ></div>
      )}

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
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/brukervilkaar"
              >
                bruk
              </a>{" "}
              og{" "}
              <a
                className="underline"
                target="__blank"
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/personvaern"
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

export default Husmodell;
