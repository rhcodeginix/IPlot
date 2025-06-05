"use client";
import React, { useEffect, useState } from "react";
import Stepper from "@/components/Ui/stepper";
import Husmodell from "./Husmodell";
import { useRouter } from "next/router";
import Tomt from "./Tomt";
import Tilbud from "./Tilbud";
import Finansiering from "./Finansiering";
// import Oppsummering from "./Oppsummering";
import ErrorPopup from "@/components/Ui/error";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Tilpass from "./Tilpass";
// import TomtHouseDetails from "./tomtDetail";

const HusmodellDetail = () => {
  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currIndex");
      if (savedIndex) {
        setCurrIndex(Number(savedIndex));
      } else {
        setCurrIndex(0);
      }
    }
  }, [currIndex]);
  const router = useRouter();
  const { plotId, husmodellId } = router.query;
  const [lamdaDataFromApi, setLamdaDataFromApi] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [additionalData, setAdditionalData] = useState<any | undefined>(null);
  const [CadastreDataFromApi, setCadastreDataFromApi] = useState<any | null>(
    null
  );
  const [askData, setAskData] = useState<any | null>(null);
  const [userUID, setUserUID] = useState(null);
  const [isCall, setIsCall] = useState(false);
  const [pris, setPris] = useState(0);
  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [HouseModelData, setHouseModelData] = useState<any>(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (additionalData?.answer) {
      try {
        const cleanAnswer = additionalData?.answer;

        setAskData(cleanAnswer);
      } catch (error) {
        console.error("Error parsing additionalData.answer:", error);
        setAskData(null);
      }
    }
  }, [additionalData]);

  const handleNext = () => {
    if (currIndex < steps.length - 1) {
      setCurrIndex(currIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currIndex]);
  useEffect(() => {
    if (currIndex < 2) {
      const { plotId, ...restQuery } = router.query;

      if (plotId) {
        router.replace(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true }
        );
      }
      setPris(0);
    }
  }, [currIndex, router]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({
              id: userDocSnapshot.id,
              ...userData,
            });
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
  }, [isCall]);
  useEffect(() => {
    if (plotId && userUID) {
      setLoading(true);

      const fetchProperty = async () => {
        const plotDocRef = doc(db, "empty_plot", String(plotId));

        try {
          const plotDocSnap = await getDoc(plotDocRef);
          if (plotDocSnap.exists()) {
            const fetchedProperties: any = {
              propertyId: plotDocSnap.id,
              ...plotDocSnap.data(),
            };

            if (fetchedProperties) {
              setAdditionalData(fetchedProperties?.additionalData);
              setLamdaDataFromApi(fetchedProperties?.lamdaDataFromApi);
              setCadastreDataFromApi(fetchedProperties?.CadastreDataFromApi);
              setPris(fetchedProperties?.pris | 0);
            } else {
              console.error("No property found with the given ID.");
            }
          }
        } catch (error) {
          console.error("Error fetching user's properties:", error);
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [plotId, db, userUID, isCall, user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setHouseModelData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (husmodellId) {
      fetchData();
    }
  }, [husmodellId, isCall, user]);
  const husmodellData = HouseModelData?.Husdetaljer;
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
  const steps = [
    {
      name: "Husmodell",
      component: (
        <Husmodell
          handleNext={handleNext}
          loading={loading}
          loginUser={loginUser}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setIsCall={setIsCall}
          HouseModelData={HouseModelData}
          pris={pris}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
        />
      ),
    },
    {
      name: "Tilpass",
      component: (
        <Tilpass
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          loading={loading}
          HouseModelData={HouseModelData}
          lamdaDataFromApi={lamdaDataFromApi}
          supplierData={supplierData}
          pris={pris}
        />
      ),
    },
    {
      name: "Tomt",
      component: (
        <Tomt
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          HouseModelData={HouseModelData}
          setLamdaDataFromApi={setLamdaDataFromApi}
          setCadastreDataFromApi={setCadastreDataFromApi}
          setAdditionalData={setAdditionalData}
          loadingAdditionalData={loading}
          loginUser={loginUser}
          loadingLamdaData={loading}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          lamdaDataFromApi={lamdaDataFromApi}
          user={user}
        />
      ),
    },
    // {
    //   name: "Detaljer",
    //   component: (
    //     <TomtHouseDetails
    //       handleNext={handleNext}
    //       handlePrevious={handlePrevious}
    //       loadingAdditionalData={loading}
    //       loginUser={loginUser}
    //       loadingLamdaData={loading}
    //       supplierData={supplierData}
    //       CadastreDataFromApi={CadastreDataFromApi}
    //       HouseModelData={HouseModelData}
    //       askData={askData}
    //       lamdaDataFromApi={lamdaDataFromApi}
    //       user={user}
    //     />
    //   ),
    // },
    {
      name: "Tilbud",
      component: (
        <Tilbud
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          supplierData={supplierData}
          handlePrevious={handlePrevious}
          pris={pris}
        />
      ),
    },
    {
      name: "Finansiering",
      component: (
        <Finansiering
          handleNext={handleNext}
          lamdaDataFromApi={lamdaDataFromApi}
          loading={loading}
          CadastreDataFromApi={CadastreDataFromApi}
          askData={askData}
          HouseModelData={HouseModelData}
          handlePrevious={handlePrevious}
          pris={pris}
          supplierData={supplierData}
        />
      ),
    },
    // {
    //   name: "Oppsummering",
    //   component: (
    //     <Oppsummering
    //       handleNext={handleNext}
    //       lamdaDataFromApi={lamdaDataFromApi}
    //       loading={loading}
    //       CadastreDataFromApi={CadastreDataFromApi}
    //       askData={askData}
    //       HouseModelData={HouseModelData}
    //       handlePrevious={handlePrevious}
    //       supplierData={supplierData}
    //       pris={pris}
    //     />
    //   ),
    // },
  ];
  return (
    <>
      <Stepper
        steps={steps}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
        // Style="true"
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default HusmodellDetail;
