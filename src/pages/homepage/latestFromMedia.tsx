import React from "react";
import Img_latest_media1 from "@/public/images/Img_latest_media1.png";
import Img_latest_media2 from "@/public/images/Img_latest_media2.png";
import Img_latest_media3 from "@/public/images/Img_latest_media3.png";
import Ic_cross_right_arrow from "@/public/images/Ic_cross_right_arrow.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Link from "next/link";

const LatestFromMedia = () => {
  return (
    <>
      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black font-semibold text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-3 lg:mb-[20px] text-center tracking-[-1px]">
            Siste fra media
          </h2>
          <p className="text-center text-secondary text-sm md:text-base lg:text-lg lg:leading-[30px] mb-6 lg:mb-[48px] desktop:mb-[60px]">
            Hold deg oppdatert med de nyeste artiklene og omtaler om iPlot. Her
            finner du <br /> siste nytt fra media om vår tjeneste og hvordan vi
            gjør byggeprosessen enklere.
          </p>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center">
            <Link href={""} className="md:w-1/2 group">
              <Image
                fetchPriority="auto"
                src={Img_latest_media1}
                alt="image"
                className="w-full mb-5 lg:mb-8"
              />
              <h5 className="text-blue text-xs md:text-sm font-semibold mb-1.5 md:mb-3">
                Finanavsien • 10 nov 2024
              </h5>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-black font-semibold text-base md:text-lg lg:text-xl desktop:text-2xl">
                  MinTomt revolusjonerer tomteanalyse
                </h3>
                <Image
                  fetchPriority="auto"
                  src={Ic_cross_right_arrow}
                  alt="arrow"
                  className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="text-secondary text-sm md:text-base mb-4 md:mb-6">
                Oppstartsselskapet <span className="font-bold">MinTomt</span>{" "}
                ønsker å gjør byggeprosessen analyseprosessen på ferdigregulerte
                tomter enklere med AI.
              </p>
              <div className="flex items-center gap-2 lg:gap-4">
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPurple text-blue text-xs lg:text-sm font-medium">
                  AI
                </span>
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightBlue text-blue2 text-xs lg:text-sm font-medium">
                  Metergruppen
                </span>
                <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPink text-pink text-xs lg:text-sm font-medium">
                  Oppstartselskap
                </span>
              </div>
            </Link>
            <div className="md:w-1/2 h-full">
              <div className="flex flex-col gap-5 lg:gap-8 h-full">
                <div className="h-1/2 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-[16px] lg:gap-[24px]">
                  <div className="sm:w-[55%] md:w-full lg:w-[55%]">
                    <Image
                      fetchPriority="auto"
                      src={Img_latest_media2}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="sm:w-[45%] md:w-full lg:w-[45%]">
                    <h5 className="text-blue text-xs md:text-sm font-semibold mb-1.5 md:mb-3">
                      DN.no • 8 Nov 2024
                    </h5>
                    <h3 className="text-black font-semibold text-sm md:text-base lg:text-lg mb-2 md:mb-4">
                      Mestergruppen satser på MinTomt
                    </h3>
                    <p className="text-secondary text-sm md:text-base mb-4 md:mb-6">
                      Mestergruppen inngår samarbeid med{" "}
                      <span className="font-bold">MinTomt</span> for å forenkle
                      byggeprosessen for boligkjøpere. Med iPlot sin
                      avanserte...
                    </p>
                    <div className="flex items-center gap-2 lg:gap-4">
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightGreen2 text-green text-xs lg:text-sm font-medium">
                        Metergruppen
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1/2 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-[16px] lg:gap-[24px]">
                  <div className="sm:w-[55%] md:w-full lg:w-[55%]">
                    <Image
                      fetchPriority="auto"
                      src={Img_latest_media3}
                      alt="image"
                      className="w-full"
                    />
                  </div>
                  <div className="sm:w-[45%] md:w-full lg:w-[45%]">
                    <h5 className="text-blue text-xs md:text-sm font-semibold mb-1.5 md:mb-3">
                      Phoenix Baker • 8 Nov 2024
                    </h5>
                    <h3 className="text-black font-semibold text-sm md:text-base lg:text-lg mb-2 md:mb-4">
                      Vil gjøre det enkelere å bygge nytt
                    </h3>
                    <p className="text-secondary text-sm md:text-base mb-4 md:mb-6">
                      Med AI og Mestergruppen på laget, skal MinTomt gjøre det
                      enklere for boligeiere å bygge drømmeboligen...
                    </p>
                    <div className="flex items-center gap-2 lg:gap-4">
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightPurple text-blue text-xs lg:text-sm font-medium">
                        AI
                      </span>
                      <span className="py-[2px] p-[10px] rounded-[16px] bg-lightGreen3 text-green2 text-xs lg:text-sm font-medium">
                        Nybygg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default LatestFromMedia;
