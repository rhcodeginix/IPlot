import React, { useState, useEffect, useRef } from "react";
import Img_how_it_work from "@/public/images/Img_how_it_work.png";
import Ic_how_work_location from "@/public/images/Ic_how_work_location.svg";
import Ic_how_work_file from "@/public/images/Ic_how_work_file.svg";
import Ic_how_work_house from "@/public/images/Ic_how_work_house.svg";
import Ic_how_work_browser from "@/public/images/Ic_how_work_browser.svg";
import Ic_how_work_money from "@/public/images/Ic_how_work_money.svg";
import Image from "next/image";
import SideSpaceContainer from "@/components/common/sideSpace";

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef<any>([]);

  const tabData: any = [
    {
      label: "Søk opp ønsket tomt",
      description: "Søk opp og velg ønsket tomt",
      icon: Ic_how_work_location,
      image: Img_how_it_work,
    },
    {
      label: "Se reguleringsbestemmelser",
      description: "Dette er basert på kommuneplaner og reguleringsplaner",
      image: Img_how_it_work,
      icon: Ic_how_work_file,
    },
    {
      label: "Få boligforslag",
      description: "Se hva som kan bygges på eiendommen",
      image: Img_how_it_work,
      icon: Ic_how_work_house,
    },
    {
      label: "Få detaljert kostnadsoverslag",
      description:
        "Fullfør søknaden og vi sender prosjektregnskap til våre banker",
      image: Img_how_it_work,
      icon: Ic_how_work_browser,
    },
    {
      label: "Søk om finansiering",
      description:
        "Fullfør søknaden og vi sender prosjektregnskap til våre banker",
      image: Img_how_it_work,
      icon: Ic_how_work_money,
    },
  ];

  useEffect(() => {
    const container: any = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;

      const sectionHeight = container.clientHeight;
      const activeIndex = Math.floor(
        (scrollPosition + sectionHeight / 2) / sectionHeight
      );
      setActiveSection(Math.min(activeIndex, tabData.length - 1));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [tabData.length]);

  const scrollToSection = (index: any) => {
    const container: any = containerRef.current;
    if (!container) return;

    const targetScroll = index * container.clientHeight;
    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const scrollSec = (index: number) => {
    if (window.innerWidth < 767) {
      setActiveSection(index);
    }
  };

  return (
    <div className="pb-[44px] md:pb-[58px] desktop:pb-[120px]">
      <SideSpaceContainer>
        <h2 className="text-black font-semibold text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-[36px] desktop:mb-[50px] text-center">
          Hvordan det fungerer
        </h2>
        <div className="hidden md:block">
          <div className="h-screen desktop:h-screen flex relative gap-8 desktop:gap-[58px]">
            <div className="w-1/2 sticky left-0 top-0 h-full flex flex-col gap-4 justify-center">
              {tabData?.map((tab: any, index: any) => (
                <div
                  key={index}
                  className={`flex w-full gap-4 items-start border-l-[4px] pl-4 desktop:pl-7 py-4 desktop:py-5 ${activeSection === index ? "border-primary" : "border-transparent"}`}
                  onClick={() => scrollToSection(index)}
                >
                  <Image
                    fetchPriority="auto"
                    src={tab.icon}
                    alt={tab.label}
                    className="w-[28px] desktop:w-auto"
                  />
                  <div className="flex flex-col gap-2 items-start">
                    <h4 className="font-medium text-black text-xl leading-[30px] normal-case">
                      {tab.label}
                    </h4>
                    <span className="text-base text-secondary font-normal leading-[24px] text-start normal-case">
                      {tab.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={containerRef}
              className="overflow-y-auto scroll-smooth overFlowScrollHidden w-1/2"
              style={{ scrollSnapType: "y mandatory" }}
            >
              {tabData?.map((tab: any, index: any) => (
                <div
                  key={index}
                  ref={(el: any) => (sectionRefs.current[index] = el)}
                  className={`h-screen scroll-snap-start flex items-center`}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Image
                    fetchPriority="auto"
                    src={tab.image}
                    alt="image"
                    className="w-full rounded-[20px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="overflow-x-auto overFlowScrollHidden">
            <div className="left-0 w-[1000px] sm:w-[1400px] top-0 h-full flex gap-3 md:justify-center mb-4">
              {tabData?.map((tab: any, index: any) => (
                <div
                  key={index}
                  className={`flex w-[240px] sm:w-[270px] gap-2.5 items-start border-b-[4px] py-3 ${activeSection === index ? "border-primary" : "border-transparent"}`}
                  onClick={() => scrollSec(index)}
                >
                  <Image
                    fetchPriority="auto"
                    src={tab.icon}
                    alt={tab.label}
                    className="w-[24px]"
                  />
                  <div className="flex flex-col gap-1.5 items-start">
                    <h4 className="font-medium text-black text-sm normal-case one_line_elipse">
                      {tab.label}
                    </h4>
                    <span className="text-xs text-secondary font-normal text-start normal-case">
                      {tab.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {tabData?.map((tab: any, index: any) => (
              <div
                key={index}
                style={{ display: activeSection === index ? "block" : "none" }}
              >
                <Image
                  fetchPriority="auto"
                  src={tab.image}
                  alt="image"
                  className="w-full rounded-[20px]"
                />
              </div>
            ))}
          </div>
        </div>
      </SideSpaceContainer>
    </div>
  );
};

export default HowItWorks;
