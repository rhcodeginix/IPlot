import Button from "@/components/common/button";
import SideSpaceContainer from "@/components/common/sideSpace";
import { Form, Formik } from "formik";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Ic_image_icon from "@/public/images/Ic_image_icon.svg";
import Ic_delete from "@/public/images/Ic_delete.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import ApiUtils from "@/api";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_gray_check_circle from "@/public/images/Ic_gray_check_circle.svg";
import Ic_pdf from "@/public/images/Ic_pdf.svg";
import SelectDropDown from "@/components/common/form/select";
import TextInputField from "@/components/common/form/inputAddText";
import MultiSelectDropDown from "@/components/common/form/multiSelect";
import toast from "react-hot-toast";
import InputField from "@/components/common/form/input";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import NorkartMap from "@/components/map";

const FasiliteterArray: any = [
  { name: "Fiskemuligheter" },
  { name: "Bredbåndstilknytning" },
  { name: "Bilvei frem" },
  { name: "Offtentlig vann/kloakk" },
  { name: "Kabel-TV" },
  { name: "Ingen gjenboere" },
  { name: "Båtplass" },
  { name: "Utsikt" },
  { name: "Strandlinje" },
  { name: "Turterreng" },
  { name: "Golfbane" },
];

interface Address2 {
  kommune: string;
  Gårsnummer: string;
  Bruksnummer: string;
  Seksjonsnummer: string;
  Festenummer: string;
}

interface FormValues {
  address: string;
  address2: Address2;
  tomt_type: string;
  Tomtestørrelse: number | null;
  Utnyttelsesgrad: number | null;
  Byggeklausul: string;
  reguleringsstatus: string;
  connectionStatus: string[];
  map_image: File | null;
  plot_images: File[];
  Tomtepris: number | null;
  Kontaktperson: string;
  Telefonnummer: string | null;
  EPostadresse: string;
  Annonsetittel: string;
  restriksjoner: string;
  Fasiliteter: string[];
  PlotLocation: string | null;
  lamdaData: any;
  cadastreData: any;
  additionalData: any;
}

const AddPlotForm = () => {
  const validationSchema = Yup.object({
    address: Yup.string().required("Adresse er påkrevd"),
    address2: Yup.object({
      kommune: Yup.string().required("Kommune er påkrevd."),
      Gårsnummer: Yup.string().required("Gårsnummer er påkrevd."),
      Bruksnummer: Yup.string().required("Bruksnummer er påkrevd."),
      Festenummer: Yup.string().notRequired(),
      Seksjonsnummer: Yup.string().notRequired(),
    }),
    tomt_type: Yup.string().required("Type tomt er påkrevd"),
    Tomtestørrelse: Yup.number().required("Tomtestørrelse er påkrevd"),
    Utnyttelsesgrad: Yup.number().required("Utnyttelsesgrad er påkrevd"),
    Byggeklausul: Yup.string().required("Byggeklausul er påkrevd"),
    reguleringsstatus: Yup.string().required("Reguleringsstatus er påkrevd"),
    connectionStatus: Yup.array().required("Velg minst én"),
    map_image: Yup.mixed().required("Map image is required"),
    plot_images: Yup.array()
      .min(2, "You must upload at least 2 images")
      .max(10, "You can upload a maximum of 10 images"),
    Tomtepris: Yup.number().required("Tomtepris er påkrevd"),
    Kontaktperson: Yup.string().required("Kontaktperson er påkrevd"),
    Telefonnummer: Yup.number().required("Telefonnummer er påkrevd"),
    EPostadresse: Yup.string()
      .email("Ugyldig e-postadresse")
      .required("EPostadresse er påkrevd"),
    Annonsetittel: Yup.string().optional(),
    restriksjoner: Yup.string().optional(),
    Fasiliteter: Yup.array().of(Yup.string()).optional(),
    PlotLocation: Yup.string().optional(),
    lamdaData: Yup.mixed().required(),
    cadastreData: Yup.mixed().required(),
    additionalData: Yup.mixed().required(),
  });
  const [userUID, setUserUID] = useState(null);

  const [data, setData] = useState<any>({
    kommune: null,
    Gårsnummer: null,
    Bruksnummer: null,
  });
  const router = useRouter();
  const { plotId } = router.query;

  const handleSubmit = async (values: any) => {
    if (userUID) {
      const userDocRef: any = doc(db, "users", userUID);
      try {
        if (plotId) {
          const plotDocRef = doc(userDocRef, "add_plot", String(plotId));
          await updateDoc(plotDocRef, values);
          toast.success("Plot updated successfully.", {
            position: "top-right",
          });
        } else {
          const propertyDb = collection(userDocRef, "add_plot");

          const querySnapshot = await getDocs(propertyDb);

          const fetchedPlots =
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) || [];

          const isDuplicate = fetchedPlots.some(
            (plot: any) => plot.address === values.address
          );

          if (!isDuplicate) {
            await addDoc(propertyDb, values);
            toast.success("Plot added successfully.", {
              position: "top-right",
            });
          } else {
            toast.error("Already used this address!", {
              position: "top-right",
            });
          }
        }
      } catch (error) {
        console.error("Error handling plot submission:", error);
      }
    }
  };

  const kartInputRef = useRef<HTMLInputElement | null>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(true);

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAddressData(json.adresser);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleInputChange = (e: any, setFieldValue: any, fieldName: any) => {
    setFieldValue(`address2.${fieldName}`, e.target.value);
  };
  const handleClearInput = (setFieldValue: any, fieldName: any) => {
    setFieldValue(`address2.${fieldName}`, "");
  };
  const convertBytesToMB = (bytes: any) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
  };
  return (
    <Formik<FormValues>
      initialValues={{
        address: "",
        address2: {
          kommune: "",
          Gårsnummer: "",
          Bruksnummer: "",
          Seksjonsnummer: "",
          Festenummer: "",
        },
        tomt_type: "",
        Tomtestørrelse: null,
        Utnyttelsesgrad: null,
        Byggeklausul: "",
        reguleringsstatus: "",
        connectionStatus: [],
        map_image: null,
        plot_images: [],
        Tomtepris: null,
        Kontaktperson: "",
        Telefonnummer: null,
        EPostadresse: "",
        Annonsetittel: "",
        restriksjoner: "",
        Fasiliteter: [],
        PlotLocation: null,
        lamdaData: null,
        cadastreData: null,
        additionalData: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        handleChange,
        handleBlur,
        values,
        setFieldValue,
        isValid,
        resetForm,
        validateForm,
      }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [adresseValue, setAddressValue] = useState("");
        const plotImageInputRef = useRef<HTMLInputElement>(null);
        const plotLocationInputRef = useRef<HTMLInputElement>(null);
        const [PlotLocationPreview, setPlotLocationPreview] =
          useState<any>(null);

        useEffect(() => {
          if (plotId && userUID) {
            const fetchProperty = async () => {
              const plotsCollectionRef = collection(
                db,
                "users",
                userUID,
                "add_plot"
              );
              try {
                const plotsSnapshot = await getDocs(plotsCollectionRef);
                const fetchedPlots = plotsSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                const foundPlot: any = fetchedPlots.find(
                  (property) => property.id === plotId
                );

                if (foundPlot) {
                  Object.keys(foundPlot).forEach((key) => {
                    if (key === "address2") {
                      Object.keys(foundPlot[key]).forEach((subKey) => {
                        setFieldValue(
                          `address2.${subKey}`,
                          foundPlot[key][subKey]
                        );
                      });
                    } else {
                      setFieldValue(key, foundPlot[key]);
                    }
                  });
                } else {
                  console.error("No property found with the given ID.");
                }
              } catch (error) {
                console.error("Error fetching user's properties:", error);
              }
            };

            fetchProperty();
          }
        }, [plotId, userUID, db]);
        useEffect(() => {
          if (
            !Object.values(values).every((val) => val !== "" && val !== null)
          ) {
            validateForm();
          }
        }, [values, validateForm]);
        const handleFileChange = async (event: any) => {
          const files: FileList | null = event.target.files;

          if (files) {
            let newImages: any = [...values.plot_images];
            let imageCount = newImages.length;

            for (let i = 0; i < files.length; i++) {
              const file: any = files[i];

              if (!["image/jpeg", "image/png"].includes(file?.type)) {
                alert("Only JPG and PNG images are allowed.");
                continue;
              }

              if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2MB.");
                continue;
              }

              if (imageCount < 10) {
                const fileType = "images";
                const timestamp = new Date().getTime();
                const fileName = `${timestamp}_${file.name}`;
                const storageRef = ref(storage, `${fileType}/${fileName}`);

                const snapshot = await uploadBytes(storageRef, file);

                const url = await getDownloadURL(snapshot.ref);

                newImages.push(url);

                setFieldValue("plot_images", newImages);

                imageCount++;
              } else {
                toast.error("You can upload a maximum of 10 images.", {
                  position: "top-right",
                });
                break;
              }
            }
          }
        };

        const handleRemoveImage = (index: number) => {
          let newImages = [...values.plot_images];
          newImages.splice(index, 1);
          setFieldValue("plot_images", newImages);
        };
        const [isOpen, setIsOpen] = useState<boolean>(true);

        const toggleAccordion = () => {
          setIsOpen(!isOpen);
        };

        useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
            if (user) {
              try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  setFieldValue("Kontaktperson", userData.name);
                  setFieldValue("EPostadresse", userData.email);
                  setUserUID(user.uid);
                } else {
                  console.error("No such document in Firestore!");
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }
          });

          return () => unsubscribe();
        }, []);

        useEffect(() => {
          const fetchData = async () => {
            if (data.kommune && data.Gårsnummer && data.Bruksnummer) {
              const lamdaApiData: any = {
                kommunenummer: data.kommune,
                gardsnummer: data.Gårsnummer,
                bruksnummer: data.Bruksnummer,
              };
              try {
                const response = await ApiUtils.LamdaApi(lamdaApiData);
                const cleanAnswer = response.body
                  .replace(/```json|```/g, "")
                  .trim();

                const data = JSON.parse(cleanAnswer);

                const CadastreDataResponse =
                  await ApiUtils.fetchCadastreData(lamdaApiData);

                setFieldValue(
                  "map_image",
                  data?.coordinates?.convertedCoordinates
                );
                setFieldValue("cadastreData", CadastreDataResponse?.apis);
                setFieldValue("lamdaData", data);
                const building =
                  CadastreDataResponse?.apis?.buildingsApi?.response?.items &&
                  CadastreDataResponse?.apis?.buildingsApi?.response?.items
                    .length > 0
                    ? "Ja"
                    : "Nei";

                setFieldValue("Byggeklausul", building);
                setFieldValue(
                  "address",
                  `${
                    CadastreDataResponse?.apis?.presentationAddressApi?.response
                      ?.item?.formatted?.line1
                  } ${
                    CadastreDataResponse?.apis?.presentationAddressApi?.response
                      ?.item?.formatted?.line2
                  }`
                );
                setAddressValue(
                  `${
                    CadastreDataResponse?.apis?.presentationAddressApi?.response
                      ?.item?.formatted?.line1
                  } ${
                    CadastreDataResponse?.apis?.presentationAddressApi?.response
                      ?.item?.formatted?.line2
                  }`
                );

                const BBOXData =
                  CadastreDataResponse?.apis?.cadastreApi?.response?.item
                    ?.geojson?.bbox;

                const isValidBBOX =
                  Array.isArray(BBOXData) && BBOXData.length === 4;

                const adjustedBBOX: any = isValidBBOX && [
                  BBOXData[0] - 30,
                  BBOXData[1] - 30,
                  BBOXData[2] + 30,
                  BBOXData[3] + 30,
                ];

                const images = isValidBBOX
                  ? [
                      `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Planomrade_02,Arealformal_02,Grenser_og_juridiske_linjer_02&STYLES=default,default,default&CRS=EPSG:25833&BBOX=${adjustedBBOX[0]},${adjustedBBOX[1]},${adjustedBBOX[2]},${adjustedBBOX[3]}&WIDTH=800&HEIGHT=600&FORMAT=image/png`,
                      `https://wms.geonorge.no/skwms1/wms.matrikkelkart?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=MatrikkelKart&STYLES=default&CRS=EPSG:25833&BBOX=${adjustedBBOX[0]},${adjustedBBOX[1]},${adjustedBBOX[2]},${adjustedBBOX[3]}&WIDTH=1024&HEIGHT=768&FORMAT=image/png`,
                    ]
                  : [];

                setFieldValue("plot_images", images);

                if (cleanAnswer) {
                  if (
                    data.message === "Request failed with status code 503" ||
                    !data.propertyId
                  ) {
                    console.error(data);
                  }

                  const areaDetails =
                    data?.eiendomsInformasjon?.basisInformasjon
                      ?.areal_beregnet || "";
                  const regionName =
                    CadastreDataResponse?.presentationAddressApi?.response?.item
                      ?.municipality?.municipalityName;
                  setFieldValue("Tomtestørrelse", areaDetails);
                  const promt = {
                    question: `Hva er tillatt gesims- og mønehøyde, maksimal BYA inkludert parkeringskrav i henhold til parkeringsnormen i ${regionName} kommune, og er det tillatt å bygge en enebolig med flatt tak eller takterrasse i dette området i ${regionName}, sone GB? Tomtestørrelse for denne eiendommen er ${areaDetails}.`,
                  };

                  let timeoutId: any;

                  try {
                    const response = await ApiUtils.askApi(promt);
                    clearTimeout(timeoutId);
                    setFieldValue("additionalData", response);
                    setFieldValue(
                      "Utnyttelsesgrad",
                      response?.answer?.bya_calculations?.input?.bya_percentage
                    );
                  } catch (error: any) {
                    console.error(
                      "Error fetching additional data from askApi:",
                      error?.message
                    );
                    clearTimeout(timeoutId);
                  }
                }
              } catch (error: any) {
                console.error(
                  "Error fetching additional data:",
                  error?.message
                );
              }
            }
          };
          fetchData();
        }, [data]);
        return (
          <Form>
            <SideSpaceContainer>
              <div className="pt-[50px] pb-[98px] flex flex-col gap-6">
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Søk opp adressen/matrikkelen
                  </h4>
                  <div className="p-6 grid grid-cols-1 gap-y-6">
                    <div className="lg:h-[80px] bg-[#F9F9FB] border-gray3 border rounded-[8px] lg:rounded-[100px] flex flex-col sm:flex-row sm:items-center relative justify-between">
                      <div className="flex flex-col lg:justify-between w-full sm:w-11/12 lg:h-[80px]">
                        <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-8 lg:items-center flex sm:justify-between relative">
                          <div className="w-[92%]">
                            <div className="text-darkBlack mb-1 text-sm">
                              Vet du hvilken adresse du vil bygge på?
                            </div>
                            <input
                              ref={kartInputRef}
                              name="address"
                              type="text"
                              className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                            ${errors.address && touched.address ? "" : ""}`}
                              placeholder="Fyll inn ønsket adresse"
                              onChange={(e: any) => {
                                setShowAddressDropdown(true);
                                handleKartInputChange(e);
                                setAddressValue(e.target.value);
                              }}
                              onBlur={handleBlur}
                              value={adresseValue || values.address}
                              autoComplete="off"
                            />
                          </div>
                          {adresseValue && (
                            <Image
                              src={Ic_close}
                              alt="close"
                              className="cursor-pointer"
                              onClick={() => {
                                setFieldValue("address", "");
                                setAddressValue("");
                                setAddressData(null);
                              }}
                              fetchPriority="auto"
                            />
                          )}
                        </div>
                        {errors.address && touched.address && (
                          <p className="text-red text-xs mt-2">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {(adresseValue || addressData) &&
                        showAddressDropdown &&
                        addressData?.length > 0 && (
                          <div
                            className="absolute top-[100px] desktop:top-[80px] left-0 bg-white rounded-[8px] py-[12px] p-2.5 desktop:px-[16px] w-full h-auto max-h-[400px] overflow-y-auto overFlowYAuto"
                            style={{
                              zIndex: 999,
                              boxShadow:
                                "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
                            }}
                          >
                            {addressData?.map((address: any, index: number) => (
                              <div
                                className="p-2 desktop:p-3 flex items-center gap-2.5 desktop:gap-4 hover:bg-lightGreen cursor-pointer"
                                key={index}
                                onClick={() => {
                                  setFieldValue(
                                    "address",
                                    `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                  );
                                  setFieldValue(
                                    "address2.kommune",
                                    `${address.kommunenummer}`
                                  );
                                  setFieldValue(
                                    "address2.Gårsnummer",
                                    `${address.gardsnummer}`
                                  );
                                  setFieldValue(
                                    "address2.Bruksnummer",
                                    `${address.bruksnummer}`
                                  );
                                  setFieldValue(
                                    "address2.Seksjonsnummer",
                                    `${address.festenummer}`
                                  );
                                  setFieldValue(
                                    "address2.Festenummer",
                                    `${address.bokstav}`
                                  );
                                  setAddressValue(
                                    `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                  );
                                  setShowAddressDropdown(false);
                                  setAddressData(null);

                                  setData({
                                    kommune: address.kommunenummer,
                                    Gårsnummer: address.gardsnummer,
                                    Bruksnummer: address.bruksnummer,
                                  });
                                }}
                              >
                                <Image
                                  src={Ic_search_location}
                                  alt="location"
                                  fetchPriority="auto"
                                />
                                <div>
                                  <span className="text-secondary text-sm desktop:text-base font-medium">
                                    Adresse:
                                  </span>{" "}
                                  <span className="text-black font-medium text-base desktop:text-lg">
                                    {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                                      "N/A"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      <div
                        className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-greenBtn rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2`}
                      >
                        <Image
                          src={Ic_search}
                          alt="search"
                          className="w-6 h-6"
                          fetchPriority="auto"
                        />
                      </div>
                    </div>
                    <div className="text-center font-medium text-sm">eller</div>
                    <div>
                      <div className="desktop:h-[80px] bg-[#F9F9FB] border-gray3 border rounded-[8px] desktop:rounded-[100px] flex flex-col desktop:flex-row desktop:items-center relative justify-between">
                        <div className="flex flex-col desktop:flex-row desktop:items-center desktop:justify-between w-full desktop:w-11/12 desktop:h-[80px]">
                          <div className="desktop:w-[20%]">
                            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                              <div className="w-[92%] lg:w-auto truncate">
                                <div className="text-darkBlack mb-1 text-sm truncate">
                                  Kommunenummer
                                </div>
                                <input
                                  type="number"
                                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.kommune ? "" : ""}`}
                                  placeholder="Søk opp kommune"
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "kommune"
                                    )
                                  }
                                  value={values.address2.kommune}
                                  name="address2.kommune"
                                  autoComplete="off"
                                />
                              </div>
                              {values.address2.kommune && (
                                <Image
                                  src={Ic_close}
                                  alt="close"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleClearInput(setFieldValue, "kommune")
                                  }
                                  fetchPriority="auto"
                                />
                              )}
                            </div>
                          </div>
                          <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                          <div className="desktop:w-[20%]">
                            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                              <div className="w-[92%] lg:w-auto truncate">
                                <div className="text-darkBlack mb-1 text-sm truncate">
                                  Gårdsnummer
                                </div>
                                <input
                                  type="number"
                                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Gårsnummer ? "" : ""}`}
                                  placeholder="Skriv Gnr."
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "Gårsnummer"
                                    )
                                  }
                                  value={values.address2.Gårsnummer}
                                />
                              </div>
                              {values.address2.Gårsnummer && (
                                <Image
                                  src={Ic_close}
                                  alt="close"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleClearInput(
                                      setFieldValue,
                                      "Gårsnummer"
                                    )
                                  }
                                  fetchPriority="auto"
                                />
                              )}
                            </div>
                          </div>
                          <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                          <div className="desktop:w-[20%]">
                            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                              <div className="w-[92%] lg:w-auto truncate">
                                <div className="text-darkBlack mb-1 text-sm truncate">
                                  Bruksnummer (valgfritt)
                                </div>
                                <input
                                  type="number"
                                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Bruksnummer ? "" : ""}`}
                                  placeholder="Skriv Bnr."
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "Bruksnummer"
                                    )
                                  }
                                  value={values.address2.Bruksnummer}
                                />
                              </div>
                              {values.address2.Bruksnummer && (
                                <Image
                                  src={Ic_close}
                                  alt="close"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleClearInput(
                                      setFieldValue,
                                      "Bruksnummer"
                                    )
                                  }
                                  fetchPriority="auto"
                                />
                              )}
                            </div>
                          </div>
                          <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                          <div className="desktop:w-[20%]">
                            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                              <div className="w-[92%] lg:w-auto truncate">
                                <div className="text-darkBlack mb-1 text-sm truncate">
                                  Seksjonsnummer (valgfritt)
                                </div>
                                <input
                                  type="number"
                                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Seksjonsnummer ? "" : ""}`}
                                  placeholder="Skriv evt. Snr."
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "Seksjonsnummer"
                                    )
                                  }
                                  value={values.address2.Seksjonsnummer}
                                />
                              </div>
                              {values.address2.Seksjonsnummer && (
                                <Image
                                  src={Ic_close}
                                  alt="close"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleClearInput(
                                      setFieldValue,
                                      "Seksjonsnummer"
                                    )
                                  }
                                  fetchPriority="auto"
                                />
                              )}
                            </div>
                          </div>
                          <div className="border-b desktop:border-b-0 desktop:border-l border-[#7D89B0] w-full desktop:w-[1px] desktop:h-[37px] border-opacity-30"></div>
                          <div className="desktop:w-[20%]">
                            <div className="w-full rounded-[12px] lg:rounded-[88px] py-3 px-2 lg:px-4 desktop:px-7 lg:items-center flex lg:justify-between relative">
                              <div className="w-[92%] lg:w-auto truncate">
                                <div className="text-darkBlack mb-1 text-sm truncate">
                                  Festenummer (valgfritt)
                                </div>
                                <input
                                  type="number"
                                  className={`focus:outline-none text-black text-base desktop:text-xl font-medium bg-transparent w-full focus:border-none focus:border-0
                  ${errors.address2?.Festenummer ? "" : ""}`}
                                  placeholder="Skriv evt. Snr."
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      setFieldValue,
                                      "Festenummer"
                                    )
                                  }
                                  value={values.address2.Festenummer}
                                />
                              </div>
                              {values.address2.Festenummer && (
                                <Image
                                  src={Ic_close}
                                  alt="close"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleClearInput(
                                      setFieldValue,
                                      "Festenummer"
                                    )
                                  }
                                  fetchPriority="auto"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`p-3 lg:p-5 cursor-pointer flex justify-center items-center bg-greenBtn rounded-full gap-[10px] transition-all duration-300 ease-out h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] m-2 ${
                            !values.address2.Gårsnummer ||
                            !values.address2.kommune ||
                            !values.address2.Bruksnummer
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            setData({
                              kommune: values.address2.kommune,
                              Gårsnummer: values.address2.Gårsnummer,
                              Bruksnummer: values.address2.Bruksnummer,
                            });
                          }}
                        >
                          <Image
                            src={Ic_search}
                            alt="search"
                            className="w-6 h-6"
                            fetchPriority="auto"
                          />
                        </div>
                      </div>
                      {errors.address2?.Gårsnummer &&
                        touched.address2?.Gårsnummer && (
                          <p className="text-red text-xs mt-2">
                            Gårsnummer er påkrevd.
                          </p>
                        )}
                      {errors.address2?.Bruksnummer &&
                        touched.address2?.Bruksnummer && (
                          <p className="text-red text-xs mt-2">
                            Bruksnummer er påkrevd.
                          </p>
                        )}
                      {errors.address2?.kommune &&
                        touched.address2?.kommune && (
                          <p className="text-red text-xs mt-2">
                            Kommune er påkrevd.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Grunninformasjon
                  </h4>
                  <div className="p-6 flex gap-[74px]">
                    <div className="w-[36%] flex flex-col gap-6">
                      <SelectDropDown
                        label="Type tomt"
                        name="tomt_type"
                        id="tomt_type"
                        placeholder="Enter Type tomt"
                        errors={errors.tomt_type}
                        touched={touched.tomt_type}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "tomt_type",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "Boligtomt",
                            label: "Boligtomt",
                          },
                          {
                            value: "Hyttetomt",
                            label: "Hyttetomt",
                          },
                          {
                            value: "Utviklingstomt",
                            label: "Utviklingstomt",
                          },
                          {
                            value: "Tomtefelt",
                            label: "Tomtefelt",
                          },
                        ]}
                        value={values.tomt_type}
                      />
                      <TextInputField
                        label="Tomtestørrelse"
                        type="number"
                        name="Tomtestørrelse"
                        id="Tomtestørrelse"
                        value={values.Tomtestørrelse}
                        placeholder="Fyll inn tomtestørrelse"
                        errors={errors}
                        touched={touched}
                        onChange={handleChange}
                        text="m²"
                        disabled={values.Tomtestørrelse ? true : false}
                      />
                      <TextInputField
                        label="Utnyttelsesgrad"
                        type="number"
                        name="Utnyttelsesgrad"
                        id="Utnyttelsesgrad"
                        value={values.Utnyttelsesgrad}
                        placeholder="Fyll inn tomtens utnyttelsesgrad"
                        errors={errors}
                        touched={touched}
                        onChange={handleChange}
                        text="% BYA"
                        disabled={values.Utnyttelsesgrad ? true : false}
                      />
                      <MultiSelectDropDown
                        label="Status i dag på tilkoblinger (vann, avløp, strøm)"
                        name="connectionStatus"
                        id="connectionStatus"
                        placeholder="Velg hva som allerede er tilkoblet tomten"
                        errors={errors.connectionStatus}
                        touched={touched.connectionStatus}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "connectionStatus",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "vann",
                            label: "vann",
                          },
                          {
                            value: "avløp",
                            label: "avløp",
                          },
                          {
                            value: "strøm",
                            label: "strøm",
                          },
                        ]}
                        value={values.connectionStatus}
                      />
                      <SelectDropDown
                        label="Byggeklausul (ja/nei)"
                        name="Byggeklausul"
                        id="Byggeklausul"
                        placeholder="Velg om tomten har byggeklausul eller ikke"
                        errors={errors.Byggeklausul}
                        touched={touched.Byggeklausul}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "Byggeklausul",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "Ja",
                            label: "Ja",
                          },
                          {
                            value: "Nei",
                            label: "Nei",
                          },
                        ]}
                        value={values.Byggeklausul}
                        disabled={values.Byggeklausul ? true : false}
                      />
                      <SelectDropDown
                        label="Reguleringsstatus"
                        name="reguleringsstatus"
                        id="reguleringsstatus"
                        placeholder="Velg eventuell reguleringsstatus"
                        errors={errors.reguleringsstatus}
                        touched={touched.reguleringsstatus}
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "reguleringsstatus",
                              value: newValue,
                            },
                          });
                        }}
                        options={[
                          {
                            value: "Uregulert",
                            label: "Uregulert",
                          },
                          {
                            value: "Regulert",
                            label: "Regulert",
                          },
                          {
                            value: "Detaljregulert",
                            label: "Detaljregulert",
                          },
                          {
                            value: "Områderegulert",
                            label: "Områderegulert",
                          },
                        ]}
                        value={values.reguleringsstatus}
                      />
                    </div>
                    <div className="w-[64%]">
                      <label className={`text-darkBlack text-sm font-semibold`}>
                        Kartutsnitt
                      </label>

                      {values.map_image ? (
                        <>
                          <div className="bg-[#EFF1F5] w-full h-[350px] rounded-[8px] overflow-hidden mt-2 relative">
                            {values?.map_image && (
                              <NorkartMap
                                coordinates={values?.map_image}
                                MAX_ZOOM={20}
                              />
                            )}
                          </div>
                        </>
                      ) : (
                        <div
                          className="bg-[#EFF1F5] w-full h-[340px] rounded-[8px] flex justify-center items-center flex-col gap-4 mt-2 relative"
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.click();
                            }
                          }}
                        >
                          <div className="cursor-pointer flex flex-col justify-center items-center">
                            <Image src={Ic_image_icon} alt="icon" />
                            <p className="text-[#4A5578] text-sm lg:text-base text-center">
                              Plot Image will be shown here according to <br />{" "}
                              your Cadastre or Plot Address
                            </p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={(event: any) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  setFieldValue("map_image", file);
                                }
                              }}
                              name="map_image"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Bilder
                  </h4>
                  <div className="p-6 flex gap-[74px]">
                    <div className="w-[36%]">
                      <label className={`text-darkBlack text-sm font-semibold`}>
                        Last opp bilder av tomten (Minimum 3 bilder, maks 10)
                      </label>
                      <div
                        className="border border-[#B9C0D4] w-full rounded-[8px] mt-2 relative p-2 cursor-pointer"
                        onClick={() => {
                          if (plotImageInputRef.current) {
                            plotImageInputRef.current.click();
                          }
                        }}
                      >
                        <div className="border border-dashed border-[#6941C6] rounded-[8px] py-5 flex flex-col gap-[10px] justify-center items-center">
                          <div className="gap-3 flex items-center">
                            <Button
                              text="Velg"
                              className="border-2 border-primary text-primary sm:text-base w-max h-36px] font-semibold relative desktop:px-4 desktop:py-2 rounded-[40px]"
                            />
                            <span className="text-darkBlack font-medium text-sm">
                              Dra & slipp for å laste opp
                            </span>
                          </div>
                          <p className="text-[#4A5578] text-sm text-center">
                            (Godkjente filformat: JPG eller PNG, max 2 MB)
                          </p>
                        </div>

                        <input
                          type="file"
                          ref={plotImageInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                          name="plot_images"
                          multiple
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="w-[64%]">
                      {values?.plot_images?.length > 0 && (
                        <div className="flex gap-6 flex-wrap">
                          {values?.plot_images?.map(
                            (preview: any, index: number) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`preview image ${index + 1}`}
                                  className="rounded-[12px] w-[134px] h-[142px]"
                                />
                                <div className="absolute top-1 right-1 cursor-pointer bg-white p-1 rounded-full">
                                  <Image
                                    src={Ic_delete}
                                    alt="delete"
                                    className=""
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImage(index);
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Pris & kontaktinformasjon
                  </h4>
                  <div className="grid grid-cols-3 gap-6 p-6">
                    <TextInputField
                      label="Tomtepris"
                      type="text"
                      inputMode="numeric"
                      name="Tomtepris"
                      id="Tomtepris"
                      value={values.Tomtepris}
                      placeholder="Fyll inn tomtepris"
                      errors={errors}
                      touched={touched}
                      onChange={({ target: { value } }: any) =>
                        handleChange({
                          target: {
                            name: "Tomtepris",
                            value: value.replace(/\D/g, "")
                              ? new Intl.NumberFormat("no-NO").format(
                                  Number(value.replace(/\D/g, ""))
                                )
                              : "",
                          },
                        })
                      }
                      text="NOK"
                    />
                    <InputField
                      label="Kontaktperson"
                      type="text"
                      name="Kontaktperson"
                      id="Kontaktperson"
                      value={values.Kontaktperson}
                      placeholder="Fyll inn kontaktperson"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      disabled={true}
                    />
                    <InputField
                      label="Telefonnummer"
                      type="number"
                      name="Telefonnummer"
                      id="Telefonnummer"
                      value={values.Telefonnummer}
                      placeholder="Fyll inn telefonnummer"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                    <InputField
                      label="E-postadresse"
                      type="email"
                      name="EPostadresse"
                      id="EPostadresse"
                      value={values.EPostadresse}
                      placeholder="Fyll inn e-postadresse"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      disabled={true}
                    />
                  </div>
                </div>
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Ekstra info (valgfritt)
                  </h4>
                  <div className="flex flex-col gap-6 p-6">
                    <InputField
                      label="Annonsetittel"
                      type="text"
                      name="Annonsetittel"
                      id="Annonsetittel"
                      value={values.Annonsetittel}
                      placeholder="Fyll inn Annonsetittel"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                    <div className="flex gap-6 items-start">
                      <div className="w-[64%]">
                        <label
                          className={`text-darkBlack text-sm font-semibold flex justify-between items-center gap-3 cursor-pointer`}
                          onClick={toggleAccordion}
                        >
                          Fasiliteter
                          {isOpen ? (
                            <Image
                              src={Ic_chevron_up}
                              alt="arrow"
                              fetchPriority="auto"
                            />
                          ) : (
                            <Image
                              src={Ic_chevron_up}
                              alt="arrow"
                              className="rotate-180"
                              fetchPriority="auto"
                            />
                          )}
                        </label>
                        {isOpen && (
                          <div className="mt-2 grid grid-cols-4 gap-x-4 gap-y-2">
                            {FasiliteterArray.map(
                              (data: any, index: number) => (
                                <label
                                  className="container container_darkgray_withPurple truncate"
                                  htmlFor={data.name}
                                  key={index}
                                >
                                  <span className="text-darkBlack text-sm md:text-base truncate">
                                    {data.name}
                                  </span>
                                  <input
                                    type="checkbox"
                                    id={data.name}
                                    value={data.name}
                                    name="Fasiliteter"
                                    checked={
                                      values.Fasiliteter.length > 0 &&
                                      values.Fasiliteter.includes(data.name)
                                    }
                                    onChange={() => {
                                      const newData =
                                        values.Fasiliteter.includes(data.name)
                                          ? values.Fasiliteter.filter(
                                              (item: string) =>
                                                item !== data.name
                                            )
                                          : [...values.Fasiliteter, data.name];
                                      setFieldValue("Fasiliteter", newData);
                                    }}
                                    className="mr-2"
                                  />

                                  <span className="checkmark checkmark_darkgray_withPurple"></span>
                                </label>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-[36%]">
                        <InputField
                          label="Tomtens beliggenhet (Nærhet til skoler, butikker osv.)"
                          type="text"
                          name="PlotLocation"
                          id="PlotLocation"
                          value={values.PlotLocation}
                          placeholder="Skriv inn tomtens kvaliteter"
                          errors={errors}
                          touched={touched}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <InputField
                      label="Eventuelle restriksjoner eller spesielle vilkår"
                      type="text"
                      name="restriksjoner"
                      id="restriksjoner"
                      value={values.restriksjoner}
                      placeholder="Fyll inn eventuelle restriksjoner og villår"
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div
                  className="rounded-[8px]"
                  style={{
                    boxShadow:
                      "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                  }}
                >
                  <h4 className="p-6 font-medium text-base lg:text-lg border-b border-[#B9C0D4]">
                    Opplasting av dokumenter (valgfritt)
                  </h4>
                  <div className="p-6 flex gap-[74px]">
                    <div className="w-[22%] bg-[#F9F9FB] rounded-[8px] p-4 flex flex-col gap-5">
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Entity Documents
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-darkBlack text-base">
                              Skjøte
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-darkBlack text-base">
                              Byggetillatelser
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Situasjonsplaner
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-darkBlack text-base">
                              Tegninger
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-darkBlack text-base">
                              reguleringsinformasjon
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-3">
                          Verdivurderingsrapport
                        </h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <Image src={Ic_gray_check_circle} alt="check" />
                            <span className="text-darkBlack text-base">
                              e-Takst (hvis tilgjengelig)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[78%]">
                      <label className={`text-darkBlack text-sm font-semibold`}>
                        Upload Document
                      </label>
                      <div className="flex items-start gap-6">
                        <div
                          className="border border-[#B9C0D4] rounded-[8px] mt-2 relative p-2 cursor-pointer w-[40%]"
                          onClick={() => {
                            if (plotLocationInputRef.current) {
                              plotLocationInputRef.current.click();
                            }
                          }}
                        >
                          <div className="border border-dashed border-[#6941C6] rounded-[8px] py-5 flex flex-col gap-[10px] justify-center items-center">
                            <div className="gap-3 flex items-center">
                              <Button
                                text="Velg"
                                className="border-2 border-primary text-primary sm:text-base w-max h-36px] font-semibold relative desktop:px-4 desktop:py-2 rounded-[40px]"
                              />
                              <span className="text-darkBlack font-medium text-sm">
                                Dra & slipp for å laste opp
                              </span>
                            </div>
                            <p className="text-[#4A5578] text-sm text-center">
                              (Godkjente filformat: JPG eller PNG, max 2 MB)
                            </p>
                          </div>

                          <input
                            type="file"
                            ref={plotLocationInputRef}
                            className="hidden"
                            onChange={async (event: any) => {
                              if (event.target.files) {
                                const file = event.target.files[0];
                                if (file) {
                                  if (file.type !== "application/pdf") {
                                    alert("Only PDF files are allowed.");
                                    return;
                                  }

                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("File size must be 2MB or smaller.");
                                    return;
                                  }

                                  const fileType = "documents";
                                  const timestamp = new Date().getTime();
                                  const fileName = `${timestamp}_${file.name}`;
                                  const storageRef = ref(
                                    storage,
                                    `${fileType}/${fileName}`
                                  );

                                  const snapshot = await uploadBytes(
                                    storageRef,
                                    file
                                  );

                                  const url = await getDownloadURL(
                                    snapshot.ref
                                  );

                                  setFieldValue("PlotLocation", url);
                                  setPlotLocationPreview(file);
                                }
                              }
                            }}
                            name="PlotLocation"
                            accept="application/pdf"
                          />
                        </div>
                        <div className="w-[60%]">
                          {PlotLocationPreview && (
                            <div className="mt-2 bg-[#F9F9FB] rounded-[8px] p-3 px-[20px] flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Image src={Ic_pdf} alt="pdf" />
                                <div className="flex flex-col">
                                  <span className="text-darkBlack text-base font-medium">
                                    {PlotLocationPreview.name}
                                  </span>
                                  <span className="text-xs text-[#4A5578]">
                                    {convertBytesToMB(PlotLocationPreview.size)}{" "}
                                    MB
                                  </span>
                                </div>
                              </div>
                              <Image
                                alt="delete"
                                src={Ic_delete}
                                className="cursor-pointer"
                                onClick={() => {
                                  setPlotLocationPreview(null);
                                  setFieldValue("PlotLocation", null);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SideSpaceContainer>

            <div className="flex items-center gap-6 justify-end sticky bottom-0 bg-white px-6 py-4 shadow-shadow1">
              <Button
                text="Avbryt"
                className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[50px]"
                onClick={() => {
                  resetForm();
                }}
              />
              <Button
                text="Fårhåndsvis"
                className="border-2 border-primary text-primary sm:text-base w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] rounded-[40px]"
              />
              <button
                className={`flex items-center border py-[4px] px-4 border-primary bg-greenBtn text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px] ${isValid ? "" : "opacity-50"}`}
                type="submit"
                disabled={!isValid}
              >
                Publiser
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPlotForm;
