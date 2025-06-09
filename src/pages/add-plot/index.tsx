import Image from "next/image";
import Img_line_bg from "@/public/images/Img_line_bg.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import AddPlotForm from "./addPlotForm";
import { useEffect, useState } from "react";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import { useRouter } from "next/router";
import Ic_close from "@/public/images/Ic_close.svg";
import LoginForm from "../login/loginForm";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import VippsButton from "@/components/vipps";

const AddPlot = () => {
  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}?login_popup=true`);
  };
  const router_query: any = { ...router.query };

  delete router_query.login_popup;

  const queryString = new URLSearchParams(router_query).toString();

  return (
    <>
      <div className="relative">
        <div className="bg-lightPurple py-[48px] relative">
          <Image
            fetchPriority="auto"
            src={Img_line_bg}
            alt="image"
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: 1 }}
          />
          <SideSpaceContainer>
            <h2 className="text-darkBlack font-medium text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] mb-1">
              Selg din tomt – helt gratis!
            </h2>
            <p className="text-[#4A5578] text-sm md:text-base desktop:text-xl">
              Legg ut din tomt på mintomt.no og{" "}
              <span className="font-bold">nå tusenvis av boligbyggere</span> som
              ser etter sin drømmetomt. <br />
              Annonsen din er{" "}
              <span className="font-bold underline">gratis</span> og{" "}
              <span className="font-bold">enkel</span> å opprette!
            </p>
          </SideSpaceContainer>
        </div>
        <AddPlotForm />
        {!loginUser && (
          <div
            className="absolute top-0 h-full w-full left-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
            }}
          ></div>
        )}
      </div>
      {isPopupOpen && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black bg-opacity-50"
          style={{
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px] relative"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <button
              className="absolute top-2 md:top-3 right-0 md:right-3"
              onClick={() => {
                setIsPopupOpen(false);
                router.push("/");
              }}
            >
              <Image src={Ic_close} alt="close" />
            </button>
            <div className="flex justify-center w-full mb-[46px]">
              <Image src={Img_vipps_login} alt="vipps login" />
            </div>
            <h2 className="text-black text-[24px] md:text-[32px] desktop:text-[40px] font-extrabold mb-2 text-center">
              Din <span className="text-primary">Min</span>Tomt-profil
            </h2>
            <p className="text-black text-xs md:text-sm desktop:text-base text-center mb-4">
              Logg inn for å få tilgang til alt{" "}
              <span className="font-bold">MinTomt x Fjellheimhytta</span> har å
              by på.
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
          />
        </div>
      )}
    </>
  );
};

export default AddPlot;
