import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import HomePageSearchTab from "@/components/Ui/homePageSearchTab";

const MainSection = () => {
  return (
    <>
      <div
        className="pt-[44px] md:pt-[52px] desktop:pt-[120px] overflow-hidden relative"
        style={{ zIndex: 999 }}
      >
        <SideSpaceContainer className="relative">
          <div className="mb-[36px] md:mb-[44px] flex flex-col justify-center items-center">
            <h1 className="text-darkBlack text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] desktop:text-[52px] big:text-[72px] leading-tight text-center mb-3 md:mb-4 desktop:mb-5">
              Bygg ditt{" "}
              <span className="text-purple2 font-semibold">drømmehus</span>{" "}
              <br />
              <span className="font-semibold">trygt</span> og{" "}
              <span className="font-semibold">enkelt</span>
            </h1>
            <p className="text-xs md:text-sm lg:text-base big:text-lg text-secondary2 text-center">
              Få umiddelbar tomteanalyse og oppdag hva du kan bygge.
            </p>
          </div>
        </SideSpaceContainer>
        <HomePageSearchTab />
      </div>
    </>
  );
};

export default MainSection;
