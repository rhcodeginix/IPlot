import React, { ReactNode, useEffect } from "react";
import Header from "../Ui/navbar";
import { UserLayoutProvider } from "@/context/userLayoutContext";
import { AddressProvider } from "@/context/addressContext";
import Chatbot from "../Ui/chatbot";
import { useRouter } from "next/router";
import { CustomizeHouseProvider } from "@/context/selectHouseContext";

type Props = {
  children: ReactNode;
};

const UserLayout = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { pathname } = router;

    if (!pathname.startsWith("/housemodell-plot")) {
      localStorage.removeItem("soverom");
      localStorage.removeItem("city");
      localStorage.removeItem("subcity");
      localStorage.removeItem("Hustype");
    }
    if (!pathname.startsWith("husmodells")) {
      localStorage.removeItem("city");
      localStorage.removeItem("subcity");
    }
    if (
      !pathname.startsWith("/housemodell-plot") &&
      !pathname.startsWith("/husmodells") &&
      !pathname.startsWith("/regulations")
    ) {
      localStorage.removeItem("customizeHouse");
    }
  }, [router.pathname, router.isReady]);
  return (
    <div>
      <Chatbot />

      <UserLayoutProvider>
        <AddressProvider>
          <CustomizeHouseProvider>
            <Header />
            <main>{children}</main>
          </CustomizeHouseProvider>
        </AddressProvider>
      </UserLayoutProvider>
    </div>
  );
};

export default UserLayout;
