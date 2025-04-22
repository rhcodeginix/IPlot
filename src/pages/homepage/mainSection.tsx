import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import HomePageSearchTab from "@/components/Ui/homePageSearchTab";

const MainSection = () => {
  const words = ["drømmebolig", "drømmehytte"];
  const speed = 50;
  const delayBetweenWords = 2000;

  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex] || "";

    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentWord.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, delayBetweenWords);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentWordIndex, words]);

  return (
    <>
      <div
        className="pt-[44px] md:pt-[52px] desktop:pt-[120px] overflow-hidden relative"
        style={{ zIndex: 999 }}
      >
        <SideSpaceContainer className="relative">
          <div className="mb-[36px] md:mb-[44px] flex flex-col justify-center items-center">
            <h1 className="text-darkBlack text-[32px] md:text-[40px] lg:text-[48px] desktop:text-[52px] big:text-[72px] leading-tight text-center mb-3 md:mb-4 desktop:mb-5 w-[333px] md:w-[416px] lg:w-[495px] desktop:w-[540px] big:w-[735px]">
              <div className="flex justify-start gap-3">
                Bygg din{" "}
                <span className={`text-purple2 typewrite font-semibold`}>
                  {displayText}
                </span>{" "}
              </div>
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
