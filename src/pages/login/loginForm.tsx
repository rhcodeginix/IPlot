"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Img_login_google from "@/public/images/Img_login_google.svg";
import { auth, db } from "@/config/firebaseConfig";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NameModal from "./nameModal";

const LoginForm: React.FC<{
  path?: any;
  setLoginPopup?: any;
  setIsCall?: any;
}> = ({ setLoginPopup, path, setIsCall }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("E-post is required"),
    password: Yup.string()
      .min(6, "Passord must be at least 6 characters")
      .required("Passord is required"),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user: any = userCredential.user;
      localStorage.setItem("min_tomt_login", "true");
      toast.success("Login successfully", { position: "top-right" });
      localStorage.setItem("I_plot_email", user.email);
      if (path) {
        setLoginPopup(false);
        router.push(path);
        if (setIsCall) {
          setIsCall(true);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error during sign-in", error);
      toast.error(
        "Login failed. Please check your credentials or register if you don't have an account.",
        {
          position: "top-right",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const googleProvider = new GoogleAuthProvider();

  const handleNameSubmit = async (name: any) => {
    if (newUser) {
      try {
        const userDocRef = doc(db, "users", newUser.uid);
        await setDoc(userDocRef, {
          email: newUser.email,
          name: name,
          uid: newUser.uid,
        });

        toast.success("Google sign-in successful!", { position: "top-right" });
        localStorage.setItem("min_tomt_login", "true");
        localStorage.setItem("I_plot_email", newUser.email);
        if (path) {
          setLoginPopup(false);
          router.push(path);
          if (setIsCall) {
            setIsCall(true);
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error saving new user", error);
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
        });
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: any = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        toast.success("Google sign-in successfull!", { position: "top-right" });
        localStorage.setItem("min_tomt_login", "true");
        localStorage.setItem("I_plot_email", user?.email);
        if (path) {
          setLoginPopup(false);
          router.push(path);
          setIsCall(true);
        } else {
          router.push("/");
        }
      } else {
        setNewUser(user);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google login popup was closed.", {
          position: "top-right",
        });
      } else {
        toast.error("Google sign-in failed. Please try again.", {
          position: "top-right",
        });
      }

      if (path) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[490px] mx-4">
      <div
        className="bg-white p-4 md:p-8 w-full rounded-lg"
        style={{
          boxShadow: "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
        }}
      >
        <h3 className="text-darkBlack text-xl md:text-2xl desktop:text-[30px] font-semibold mb-1.5 md:mb-3 text-center">
          Logg in på din konto
        </h3>
        <p className="text-secondary text-sm md:text-base mb-4 md:mb-8 text-center">
          Velkommen tilbake! Vennligst oppgi dine detaljer.
        </p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4 flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className={`${errors.email && touched.email ? "text-red" : "text-black"} text-sm`}
                >
                  E-post
                </label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  className={`w-full p-2 rounded-md border ${errors.email && touched.email ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                  placeholder="Enter your e-post"
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
                  Passord
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`w-full p-2 rounded-md border ${errors.password && touched.password ? "border-red" : "border-gray"} focus-visible:border-gray focus-visible:outline-none focus:border-gray `}
                  placeholder="Enter your Passord"
                />
                {errors.password && touched.password && (
                  <div className="text-red text-sm">{errors.password}</div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  text="Logg inn"
                  className="border border-greenBtn bg-greenBtn text-white sm:text-base rounded-[40px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex items-center justify-center text-[#4F4F4F] mt-3 text-sm md:text-base">
          Didn’t Registered?{" "}
          <Link href={"/register"} className="text-black font-semibold">
            &nbsp;Register Here
          </Link>
        </div>
        <div
          onClick={signInWithGoogle}
          className="text-black border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 mt-4 md:mt-6 flex gap-2 justify-center items-center cursor-pointer text-sm md:text-base"
          style={{
            boxShadow: "0px 1px 2px 0px #1018280D",
          }}
        >
          <Image src={Img_login_google} alt="google" fetchPriority="high" />
          Logg inn med Google
        </div>
      </div>
      {loading && (
        <div className="absolute top-0 left-0">
          <Loader />
        </div>
      )}
      <NameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
      />
    </div>
  );
};

export default LoginForm;
