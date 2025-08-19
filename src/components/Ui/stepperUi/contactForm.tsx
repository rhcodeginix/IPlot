import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "@/components/common/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const ContactForm: React.FC<{ leadId?: any }> = ({ leadId }) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const validationSchema = Yup.object().shape({
    checkbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });
  const stored = localStorage.getItem("customizeHouse");

  useEffect(() => {
    (async () => {
      try {
        const docSnap: any = await getDoc(doc(db, "leads", leadId));

        if (docSnap.data().Isopt === true) {
          setIsShow(false);
        }
        if (docSnap.exists()) {
          setIsChecked(docSnap.data().Isopt || false);
        }
      } catch (error) {
        console.error("Error fetching Isopt status:", error);
      }
    })();
  }, [leadId]);
  const handleSubmit = async () => {
    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", leadId), {
          Isopt: true,
          updatedAt: new Date(),
          stored,
        });
        toast.success("Added successfully.", { position: "top-right" });
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
      setIsChecked(true);
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

    fetchData();
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
      {isShow && (
        <div className="bg-[#42307D] rounded-[12px] p-6">
          <Formik
            initialValues={{ checkbox: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="flex gap-6 justify-between">
                  <div>
                    <p className="text-white text-lg mb-4">
                      Ønsker du å{" "}
                      <span className="font-semibold">bli kontaktet</span> av{" "}
                      <span className="font-semibold">
                        {supplierData?.company_name}
                      </span>{" "}
                      vedrørende denne eiendommen?
                    </p>
                    <label className="flex items-center gap-[12px] container">
                      <Field
                        type="checkbox"
                        name="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setFieldValue("checkbox", !values.checkbox);
                          handleCheckboxChange();
                        }}
                      />
                      <span className="checkmark"></span>

                      <div className="text-[#FFFFFFCC] text-base">
                        Jeg aksepterer{" "}
                        <span className="text-white">deling av data</span> med{" "}
                        <span className="text-white">
                          {supplierData?.company_name}.
                        </span>
                      </div>
                    </label>
                    {errors.checkbox && touched.checkbox && (
                      <div className="text-red text-sm">{errors.checkbox}</div>
                    )}
                  </div>
                  <div>
                    <Button
                      text="Send inn"
                      className={`border border-primary bg-white text-primary hover:border-[#7A5AF8] hover:text-[#7A5AF8] focus:border-[#5925DC] focus:text-[#5925DC] sm:text-base rounded-[40px] w-[176px] h-[48px] font-semibold ${!isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                      type="submit"
                      disabled={!isChecked}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default ContactForm;
