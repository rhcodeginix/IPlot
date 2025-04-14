import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_logo from "@/public/images/Ic_logo_footer.svg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="bg-navyBlue">
        <SideSpaceContainer>
          <div className="pt-[40px] md:pt-[52px] lg:pt-[80px] pb-[24px] md:pb-[36px] lg:pb-[48px] flex flex-col desktop:flex-row desktop:items-end gap-6 justify-between">
            <div>
              <Image
                src={Ic_logo}
                alt="logo"
                className="mb-[20px] lg:mb-[36px] w-[90px] lg:w-auto"
                fetchPriority="auto"
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:items-end">
                <span className="text-white font-medium text-sm md:text-base">
                  iPlot AS
                  <br className="hidden sm:block" />
                  834632772
                  <br className="hidden sm:block" />
                  Sokkabekkveien 81, 3478 Nærsnes
                </span>
                <span className="text-white font-medium text-sm md:text-base">
                  +47 48 17 97 60
                </span>
                <span className="text-white font-medium text-sm md:text-base">
                  fenger@iplot.no
                </span>
              </div>
            </div>
            <div>
              <div className="sm:items-center gap-4 lg:gap-[38px] flex flex-col sm:flex-row mb-[12px]">
                <Link
                  href={""}
                  className="text-sm md:text-base text-white font-medium"
                >
                  Hvordan fungerer iPlot?
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-white font-medium"
                >
                  Priser
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-white font-medium"
                >
                  Referanser
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-white font-medium"
                >
                  Kontakt
                </Link>
                <Link
                  href={""}
                  className="text-sm md:text-base text-white font-medium"
                >
                  Logg inn
                </Link>
              </div>
              <p className="text-xs md:text-sm text-white font-medium desktop:text-end">
                © 2024 iPlot AS. All rights reserved.
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Footer;
