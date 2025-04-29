"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Welcome = () => {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .oneOf(["Iplot@2025"], "Password is incorrect")
      .required("Password is required"),
  });

  const router = useRouter();
  const handleSubmit = async () => {
    toast.success("Congratulation!, Your Password is right.", {
      position: "top-right",
    });
    router.push("/");
    sessionStorage.setItem("min_tomt_welcome", "true");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const code: any = urlParams.get("code");
    // const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (code) {
      callApi(code);
    } else if (error) {
      console.error(error);
    } else {
      // No code or error found
      const noParamsDiv = document.createElement("div");
      noParamsDiv.innerHTML = `
        <h3>No code or error parameters found</h3>
        <p>This redirect doesn't contain the expected parameters from Vipps.</p>
      `;
      document.body.appendChild(noParamsDiv);
    }

    // Function to call your API with the code
    function callApi(code: any) {
      fetch(
        "https://9spebvryg9.execute-api.eu-north-1.amazonaws.com/prod/vipps",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code }),
        }
      )
        .then((response) => response.json())

        .then(async (data) => {
          console.log(data);

          const { user } = data;

          const userEmail = user.email;
          const userName = user.name;
          const userUid = user.id;

          const usersRef = collection(db, "users");

          const q = query(usersRef, where("email", "==", userEmail));

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            try {
              const existingUserDoc: any = querySnapshot.docs[0];
              const userData = existingUserDoc.data();

              if (
                userData.loginType === "form" ||
                userData.loginType === "google"
              ) {
                router.push("/login");
                toast.error(
                  `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
                  {
                    position: "top-right",
                  }
                );
                return;
              }
              await signInWithEmailAndPassword(auth, userEmail, userUid);
              localStorage.setItem("min_tomt_login", "true");
              toast.success("Vipps login successfully", {
                position: "top-right",
              });
              localStorage.setItem("I_plot_email", user.email);
              router.push("/");
            } catch (error) {
              console.error("Login error:", error);
              toast.error("Login failed.");
            }
          } else {
            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                userEmail,
                userUid
              );
              const createdUser = userCredential.user;

              const userDocRef = doc(db, "users", createdUser.uid);

              const docSnap = await getDoc(userDocRef);

              if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                  email: createdUser.email,
                  uid: createdUser.uid,
                  loginType: "vipps",
                  name: userName,
                  createdAt: new Date(),
                });
                await signInWithEmailAndPassword(auth, userEmail, userUid);
                localStorage.setItem("min_tomt_login", "true");
                toast.success("Vipps login successfully", {
                  position: "top-right",
                });
                router.push("/");
                localStorage.setItem("I_plot_email", user.email);
              }
            } catch (error: any) {
              if (error.code === "auth/email-already-in-use") {
                const existingUserDoc: any = querySnapshot.docs[0];
                const userData = existingUserDoc.data();

                if (
                  userData.loginType === "form" ||
                  userData.loginType === "google"
                ) {
                  router.push("/login");
                  toast.error(
                    `Already have user with ${userData.loginType === "form" ? "form fill" : `${userData.loginType} login`}`,
                    {
                      position: "top-right",
                    }
                  );
                  return;
                }
                try {
                  await signInWithEmailAndPassword(auth, userEmail, userUid);
                  localStorage.setItem("min_tomt_login", "true");
                  toast.success("Vipps login successfully", {
                    position: "top-right",
                  });
                  router.push("/");
                  localStorage.setItem("I_plot_email", user.email);
                } catch (error) {
                  console.error("Login error:", error);
                  router.push("/login");
                  toast.error("Vipps login failed.");
                }
              } else {
                console.error("Error:", error.message);
                router.push("/login");
                toast.error("An error occurred. Please try again.", {
                  position: "top-right",
                });
              }
            }
          }
        })
        .catch((error) => {
          router.push("/login");
          console.error("API error:", error);
          toast.error("Something went wrong!.", {
            position: "top-right",
          });
        });
    }
  }, []);

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
          <div className="flex flex-col items-center justify-center gap-3 mb-5">
            <Image src={Ic_logo} alt="logo" fetchPriority="auto" />
            <h2 className="text-2xl font-semibold">Welcome MinTomt</h2>
          </div>

          <Formik
            initialValues={{ password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
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
                    className="border border-primary bg-white text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
