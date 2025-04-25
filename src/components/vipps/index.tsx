import React from "react";
import { getVippsLoginUrl } from "@/utils/vippsAuth";
import Ic_vipps from "@/public/images/Ic_vipps.svg";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const VippsButton = () => {
  const { toast } = useToast();

  const handleVippsLogin = () => {
    try {
      const vippsUrl = getVippsLoginUrl();
      console.log("Redirecting to Vipps login:", vippsUrl);

      toast({
        title: "Redirecting to Vipps",
        description: `You'll be redirected to Vipps login page (${new URL(vippsUrl).origin}). Redirect URL: ${new URL(vippsUrl).searchParams.get("redirect_uri")}`,
      });

      setTimeout(() => {
        window.location.href = vippsUrl;
      }, 800);
    } catch (error) {
      console.error("Failed to initiate Vipps login:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to Vipps. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={handleVippsLogin}
      className="text-black border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 mt-4 md:mt-6 flex gap-2 justify-center items-center cursor-pointer text-sm md:text-base"
      style={{
        boxShadow: "0px 1px 2px 0px #1018280D",
      }}
    >
      <Image src={Ic_vipps} alt="google" fetchPriority="high" />
      Logg inn med Vipps
    </div>
  );
};

export default VippsButton;
