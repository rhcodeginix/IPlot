"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import LoginForm from "./loginForm";
import Link from "next/link";
import Image from "next/image";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Img_login_bg from "@/public/images/Img_login_bg.png";

const Login = () => {
  return (
    <div className="relative">
      <div
        className="border-b border-gray3 py-5 fixed top-0 w-full"
        style={{ zIndex: 99999 }}
      >
        <SideSpaceContainer>
          <Link href={"/"}>
            <Image
              src={Ic_logo}
              alt="logo"
              className="w-[90px] lg:w-auto"
              fetchPriority="auto"
            />
          </Link>
        </SideSpaceContainer>
      </div>
      <div
        className="w-full h-screen flex items-center justify-center relative"
        style={{ zIndex: 999 }}
      >
        <LoginForm />
      </div>
      <div
        className="absolute bottom-36 md:bottom-12 w-full"
        style={{ zIndex: 99 }}
      >
        <Image src={Img_login_bg} alt="image" className="w-full" />
      </div>
    </div>
  );
};

export default Login;
