import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Img_pms_SB1_Halling_Valdr_verti_pos from "@/public/images/Img_pms_SB1_Halling_Valdr_verti_pos.png";
import Img_steddy from "@/public/images/Img_steddy.png";
import Img_NexonTechWhite from "@/public/images/Img_NexonTechWhite.png";

const OurPartners = () => {
  return (
    <>
      <div className="py-[44px] md:py-[58px] desktop:py-[80px] overflow-hidden bg-purple">
        <SideSpaceContainer className="relative">
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 items-center justify-center">
            <h3 className="text-white font-semibold text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              Våre samarbeidspartnere
            </h3>
            <div className="flex items-center justify-between sm:justify-center w-full gap-4 md:gap-8 lg:gap-12 desktop:gap-[96px] overflow-x-auto overFlowScrollHidden">
              <Image
                fetchPriority="auto"
                src={Img_pms_SB1_Halling_Valdr_verti_pos}
                alt="logo"
                className="w-[130px] md:w-[170px] desktop:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Img_steddy}
                alt="logo"
                className="w-[130px] md:w-[170px] desktop:w-auto"
              />
              <Image
                fetchPriority="auto"
                src={Img_NexonTechWhite}
                alt="logo"
                className="w-[130px] md:w-[170px] desktop:w-auto"
              />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default OurPartners;
