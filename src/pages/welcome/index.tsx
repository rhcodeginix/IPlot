"use client";
import Button from "@/components/common/button";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

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

    // Log everything for debugging
    console.log("=== Vipps Redirect Debug ===");
    console.log("Full URL:", window.location.href);
    console.log("All URL parameters:", Object.fromEntries(urlParams.entries()));

    // Specifically check for code and state
    const code: any = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    console.log("Authorization code:", code);
    console.log("State parameter:", state);
    console.log("Error (if any):", error);

    // If code exists, display it and provide an option to call your API
    if (code) {
      // Create elements to show the code was received
      const infoDiv = document.createElement("div");
      infoDiv.innerHTML = `
        <h3>Code received from Vipps</h3>
        <p>Code: ${code}</p>
        <p>State: ${state || "No state parameter"}</p>
        <button id="callApi">Call API with this code</button>
      `;
      document.body.appendChild(infoDiv);

      // Add click handler for the button
      const callApiVab: any = document.getElementById("callApi");
      callApiVab.addEventListener("click", function () {
        callApi(code);
      });
    } else if (error) {
      // Display error information
      const errorDiv = document.createElement("div");
      errorDiv.innerHTML = `
        <h3>Error from Vipps</h3>
        <p>Error: ${error}</p>
        <p>Description: ${urlParams.get("error_description") || "No description"}</p>
      `;
      document.body.appendChild(errorDiv);
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
      console.log("Calling API with code:", code);

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
        .then((data) => {
          console.log("API response:", data);

          // Display the API response
          const responseDiv = document.createElement("div");
          responseDiv.innerHTML = `
          <h3>API Response</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
          document.body.appendChild(responseDiv);
        })
        .catch((error) => {
          console.error("API error:", error);

          // Display the error
          const errorDiv = document.createElement("div");
          errorDiv.innerHTML = `
          <h3>API Error</h3>
          <p>${error.message || "Unknown error"}</p>
        `;
          document.body.appendChild(errorDiv);
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
