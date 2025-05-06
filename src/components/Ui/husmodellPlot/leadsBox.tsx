import Image from "next/image";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import React, { useEffect, useState } from "react";
import Button from "@/components/common/button";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

const LeadsBox: React.FC<{ col?: any; isShow?: any }> = ({ col, isShow }) => {
  const validationBankSchema = Yup.object().shape({
    sharingData: Yup.boolean()
      .oneOf([true], "You must accept this")
      .required("Påkrevd"),
  });
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });
  const router = useRouter();
  const { propertyId, husmodellId } = router.query;

  const [leadId, setLeadId] = useState(router.query["leadId"]);

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    setLeadId(router.query["leadId"]);
  }, [router.query["leadId"]]);

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
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !propertyId || !husmodellId) {
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");

      try {
        let plotCollectionRef = collection(db, "empty_plot");
        const plotDocRef = doc(plotCollectionRef, String(propertyId));
        const plotDocSnap = await getDoc(plotDocRef);

        const husmodellDocRef = doc(db, "house_model", String(husmodellId));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        const finalData = {
          plot: { id: propertyId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };

        const leadsCollectionRef = collection(db, "leads");
        const querySnapshot: any = await getDocs(
          query(
            leadsCollectionRef,
            where("finalData.plot.id", "==", propertyId),
            where("finalData.husmodell.id", "==", husmodellId)
          )
        );

        if (!querySnapshot.empty) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, leadId: querySnapshot.docs[0].id },
          });
          setLeadId(querySnapshot.docs[0].id);
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

        router.replace({
          pathname: router.pathname,
          query: { ...router.query, leadId: docRef.id },
        });
        setLeadId(docRef.id);
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (propertyId && husmodellId && !leadId) {
      fetchData();
    }
  }, [propertyId, husmodellId, user]);

  const handleSubmit = async () => {
    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          Isopt: true,
          updatedAt: new Date(),
        });
        toast.success("Update Lead successfully.", { position: "top-right" });
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  const handleBankSubmit = async (values: any) => {
    const bankValue = values;

    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          IsoptForBank: true,
          updatedAt: new Date(),
          bankValue,
        });
        toast.success("Update Bank Lead successfully.", {
          position: "top-right",
        });
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  const [finalData, setFinalData] = useState<any>(null);
  const id = router.query["husmodellId"];
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
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);
  const husmodellData = finalData?.Husdetaljer;
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
  return (
    <>
      <div
        className={`flex pt-6 gap-4 md:gap-6 ${col ? "flex-col" : "flex-col md:flex-row"}`}
      >
        {!isShow && (
          <div
            className={`${!col ? "md:w-1/2" : "w-full"} bg-[#F5F8FF] rounded-[12px] p-4 md:p-5`}
          >
            <Formik
              initialValues={{
                sharingData: false,
              }}
              validationSchema={validationBankSchema}
              onSubmit={handleBankSubmit}
            >
              {({ setFieldValue, errors, touched, values }) => {
                useEffect(() => {
                  (async () => {
                    try {
                      const docSnap = await getDoc(
                        doc(db, "leads", String(leadId))
                      );

                      if (docSnap.exists()) {
                        const data = docSnap.data();

                        setFieldValue(
                          "sharingData",
                          data.IsoptForBank || false
                        );
                      }
                    } catch (error) {
                      console.error(
                        "Error fetching IsoptForBank status:",
                        error
                      );
                    }
                  })();
                }, [leadId]);
                return (
                  <Form>
                    <div>
                      <Image
                        fetchPriority="auto"
                        src={Ic_spareBank}
                        alt="icon"
                        className="mb-4 md:mb-6 w-[152px]"
                      />
                      <div className="text-black text-sm md:text-base lg:text-lg font-light mb-4 md:mb-6">
                        Vil du å bli kontaktet angående{" "}
                        <span className="font-bold">finansiering</span> av denne
                        eiendommen?
                      </div>
                      <div className="flex flex-col sm:flex-row sn:items-center justify-between gap-3">
                        <div>
                          <label className="flex items-center container">
                            <Field type="checkbox" name="sharingData" />

                            <span
                              className="checkmark checkmark_primary"
                              style={{ margin: "2px" }}
                            ></span>

                            <div className="text-secondary2 text-xs md:text-sm">
                              Jeg aksepterer{" "}
                              <span className="font-bold"> deling av data</span>{" "}
                              med <span className="font-bold">SpareBank1</span>
                            </div>
                          </label>
                          {touched.sharingData && errors.sharingData && (
                            <p className="text-red text-xs mt-1">
                              {errors.sharingData}
                            </p>
                          )}
                        </div>
                        <Button
                          text="Kontakt meg"
                          className={`border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-semibold relative ${!values.sharingData ? "opacity-50 cursor-not-allowed" : ""}`}
                          type="submit"
                          disabled={!values.sharingData}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
        <div
          className={`${!col ? "md:w-1/2" : "w-full"} bg-[#F5F8FF] rounded-[12px] p-4 md:p-5`}
        >
          <Formik
            initialValues={{ checkbox: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => {
              useEffect(() => {
                (async () => {
                  try {
                    const docSnap = await getDoc(
                      doc(db, "leads", String(leadId))
                    );

                    if (docSnap.exists()) {
                      const data = docSnap.data();

                      setFieldValue("checkbox", data.Isopt || false);
                    }
                  } catch (error) {
                    console.error("Error fetching Isopt status:", error);
                  }
                })();
              }, [leadId]);
              return (
                <Form>
                  <img
                    src={supplierData?.photo}
                    alt="icon"
                    className="mb-4 md:mb-6 w-[152px]"
                  />
                  <div className="text-black text-sm md:text-base lg:text-lg font-light mb-4 md:mb-6">
                    Ønsker du å bli kontaktet av{" "}
                    <span className="font-bold">
                      {supplierData?.company_name}
                    </span>{" "}
                    angående denne eiendommen?
                  </div>
                  <div className="flex flex-col sm:flex-row sn:items-center justify-between gap-3">
                    <div>
                      <label className="flex items-center container">
                        <Field type="checkbox" name="checkbox" />

                        <span
                          className="checkmark checkmark_primary"
                          style={{ margin: "2px" }}
                        ></span>

                        <div className="text-secondary2 text-xs md:text-sm">
                          Jeg aksepterer{" "}
                          <span className="font-bold"> deling av data</span> med{" "}
                          <span className="font-bold">
                            {supplierData?.company_name}
                          </span>
                        </div>
                      </label>
                      {touched.checkbox && errors.checkbox && (
                        <p className="text-red text-xs mt-1">
                          {errors.checkbox}
                        </p>
                      )}
                    </div>
                    <div>
                      <Button
                        text="Kontakt meg"
                        className={`border-2 border-[#6927DA] text-[#6927DA] hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-semibold relative ${!values.checkbox ? "opacity-50 cursor-not-allowed" : ""}`}
                        type="submit"
                        disabled={!values.checkbox}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default LeadsBox;
