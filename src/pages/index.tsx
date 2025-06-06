"use client";
import React, { useEffect } from "react";
import MainSection from "./homepage/mainSection";
import HowItWorks from "./homepage/howItWorks";
import Advantages from "./homepage/advantages";
import Analysis from "./homepage/analysis";
import OurPartners from "./homepage/ourPartners";
import Footer from "@/components/Ui/footer";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const code: any = urlParams.get("code");
    const error = urlParams.get("error");

    if (code) {
      callApi(code);
    } else if (error) {
      console.error(error);
    }

    function callApi(code: any) {
      fetch(
        "https://ox9ncjtau6.execute-api.eu-north-1.amazonaws.com/prod/auth",
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
          data = JSON.parse(data);

          const userEmail = data?.email;
          const userName = data?.name;
          const userUid = data?.sub;

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
              const userDocRef = doc(db, "users", userEmail);

              await updateDoc(userDocRef, {
                updatedAt: new Date(),
                loginCount: increment(1),
              });
              toast.success("Vipps login successfully", {
                position: "top-right",
              });
              localStorage.setItem("I_plot_email", userEmail);
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
                  address: data?.address,
                  data: data,
                });
                await signInWithEmailAndPassword(auth, userEmail, userUid);
                localStorage.setItem("min_tomt_login", "true");
                toast.success("Vipps login successfully", {
                  position: "top-right",
                });

                await updateDoc(userDocRef, {
                  updatedAt: new Date(),
                  loginCount: increment(1),
                });
                router.push("/");
                localStorage.setItem("I_plot_email", userEmail);
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
                  const userDocRef = doc(db, "users", userEmail);

                  await updateDoc(userDocRef, {
                    updatedAt: new Date(),
                    loginCount: increment(1),
                  });
                  localStorage.setItem("I_plot_email", userEmail);
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
      <MainSection />
      {/* <HouseCabinMould /> */}
      <HowItWorks />
      <OurPartners />
      <Advantages />
      <Analysis />
      <Footer />
    </div>
  );
};

export default index;
