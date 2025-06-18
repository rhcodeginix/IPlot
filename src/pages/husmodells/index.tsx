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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Tilpass from "./Tilpass";
import ApiUtils from "@/api";
import Verdivurdering from "./Verdivurdering";
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
  // const { plotId, husmodellId } = router.query;
  const {
    plotId,
    husmodellId,
    kommunenummer,
    gardsnummer,
    bruksnummer,
    kommunenavn,
  } = router.query;
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
    if (plotId && userUID && !kommunenummer) {
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
      if (!(kommunenummer && gardsnummer && bruksnummer)) return;

      const lamdaApiData = { kommunenummer, gardsnummer, bruksnummer };

      try {
        const response = await ApiUtils.LamdaApi(lamdaApiData);
        const cleanAnswer = response.body.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanAnswer);
        const CadastreDataResponse =
          await ApiUtils.fetchCadastreData(lamdaApiData);
        setLamdaDataFromApi(data);
        if (
          !cleanAnswer ||
          data.message === "Request failed with status code 503" ||
          !data.propertyId
        ) {
          setLoading(false);
          setShowErrorPopup(true);
          return;
        }
        if (CadastreDataResponse && CadastreDataResponse?.apis) {
          setCadastreDataFromApi(CadastreDataResponse?.apis);
        }
        const areaDetails =
          data?.eiendomsInformasjon?.basisInformasjon?.areal_beregnet || "";
        const regionName =
          CadastreDataResponse?.presentationAddressApi?.response?.item
            ?.municipality?.municipalityName;
        const prompt = {
          question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${kommunenavn || regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${kommunenavn || regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
        };

        try {
          const additionalResponse = await ApiUtils.askApi(prompt);

          const property = {
            lamdaDataFromApi: data,
            additionalData: additionalResponse,
            CadastreDataFromApi: CadastreDataResponse.apis,
            pris: null,
          };
          const propertyId = data.propertyId;
          const queryParams = new URLSearchParams(window.location.search);
          queryParams.set("plotId", propertyId);
          queryParams.delete("empty");

          const isEmptyPlot =
            !CadastreDataResponse?.apis?.buildingsApi?.response?.items?.length;
          const collectionName = isEmptyPlot ? "empty_plot" : "plot_building";
          queryParams.set("empty", isEmptyPlot ? "true" : "false");

          const collectionRef = collection(db, collectionName);
          const existingQuery = query(
            collectionRef,
            isEmptyPlot
              ? where("id", "==", propertyId)
              : where("lamdaDataFromApi.propertyId", "==", propertyId)
          );
          const querySnapshot = await getDocs(existingQuery);

          let docId, plotData;
          if (!querySnapshot.empty) {
            const docSnap: any = querySnapshot.docs[0];
            docId = docSnap.id;
            plotData = docSnap.data();
          } else {
            const docRef = await addDoc(collectionRef, property);
            docId = docRef.id;
            plotData =
              (await getDoc(doc(db, collectionName, docId))).data() || null;
          }

          const updatedPlotData = {
            ...plotData,
            view_count: (plotData?.view_count || 0) + 1,
          };
          await setDoc(doc(db, collectionName, docId), updatedPlotData, {
            merge: true,
          });

          const viewerDocRef = doc(
            db,
            `${collectionName}/${docId}/viewer`,
            user.uid
          );
          const viewerDocSnap = await getDoc(viewerDocRef);
          let viewerViewCount = 1;

          if (viewerDocSnap.exists()) {
            const viewerData = viewerDocSnap.data();
            viewerViewCount = (viewerData?.view_count || 0) + 1;
          }

          await setDoc(
            viewerDocRef,
            {
              userId: user.uid,
              name: user.name || "N/A",
              last_updated_date: new Date().toISOString(),
              view_count: viewerViewCount,
            },
            { merge: true }
          );

          router.replace({
            pathname: router.pathname,
            query: Object.fromEntries(queryParams),
          });
          // if (additionalResponse) {
          //   setLamdaDataFromApi(data);
          //   if (CadastreDataResponse && CadastreDataResponse?.apis) {
          //     setCadastreDataFromApi(CadastreDataResponse?.apis);
          //   }
          setAdditionalData(additionalResponse);
          // }
        } catch (error) {
          console.error("Error fetching additional data from askApi:", error);
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowErrorPopup(true);
      }
    };

    if (isCall && user && kommunenummer && gardsnummer && bruksnummer) {
      fetchData();
    }
  }, [kommunenummer, gardsnummer, bruksnummer, isCall, user, userUID]);

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
          user={user}
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
          user={user}
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
          user={user}
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
    {
      name: "Verdivurdering",
      component: (
        <Verdivurdering
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
  ];
  return (
    <>
      <Stepper
        steps={steps}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
        Style="true"
      />
      {showErrorPopup && <ErrorPopup />}
    </>
  );
};

export default HusmodellDetail;
