"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Ic_logo from "@/public/images/Ic_logo.svg";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";

const Register = () => {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    name: Yup.string().required("Full Name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    const auth = getAuth();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          uid: user.uid,
          name: values.name,
          createdAt: new Date(),
        });
        router.push("/login");
        toast.success("User Create Successfully", { position: "top-right" });
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("User already exists.", { position: "top-right" });
      } else {
        console.error("Error:", error.message);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className="w-full mx-4 max-w-[490px] bg-white p-7"
          style={{
            boxShadow:
              "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
          }}
        >
          <Link href={"/"}>
            <Image src={Ic_logo} alt="logo" fetchPriority="auto" />
          </Link>
          <Formik
            initialValues={{ email: "", password: "", name: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-4 flex flex-col gap-1">
                  <label
                    htmlFor="name"
                    className={`${errors.name && touched.name ? "text-red" : "text-black"} text-sm`}
                  >
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className={`w-full p-2 rounded-md border ${errors.name && touched.name ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                    placeholder="Enter your Full Name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red text-sm">{errors.name}</div>
                  )}
                </div>
                <div className="mb-4 flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className={`${errors.email && touched.email ? "text-red" : "text-black"} text-sm`}
                  >
                    Email
                  </label>
                  <Field
                    type="text"
                    name="email"
                    id="email"
                    className={`w-full p-2 rounded-md border ${errors.email && touched.email ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red text-sm">{errors.email}</div>
                  )}
                </div>

                <div className="mb-4 flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className={`${errors.password && touched.password ? "text-red" : "text-black"} text-sm`}
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`w-full p-2 rounded-md border ${errors.password && touched.password ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                    placeholder="Enter your password"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red text-sm">{errors.password}</div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    text="Send inn"
                    className="border border-primary bg-white text-primary sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
          <div className="flex items-center justify-center text-[#4F4F4F] mt-3">
            You already have account?{" "}
            <Link href={"/login"} className="text-black font-semibold">
              &nbsp;Login Here
            </Link>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute top-0 left-0">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Register;
