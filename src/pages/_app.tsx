import { AppProps } from "next/app";
import "../styles/globals.css";
import { useRouter } from "next/router";
import UserLayout from "@/components/Layout/userLayout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { CustomizeHouseProvider } from "@/context/selectHouseContext";

const publicRoutes = ["/login", "/register"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";

    if (isLoggedIn && publicRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [router.pathname]);

  if (publicRoutes.includes(router.pathname)) {
    return (
      <>
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            style: {
              zIndex: 9999999999,
            },
          }}
        />
      </>
    );
  }

  return (
    <>
      <CustomizeHouseProvider>
        <UserLayout>
          <Component {...pageProps} />
          <Toaster
            toastOptions={{
              style: {
                zIndex: 9999999999,
              },
            }}
          />
        </UserLayout>
      </CustomizeHouseProvider>
    </>
  );
}

export default MyApp;
