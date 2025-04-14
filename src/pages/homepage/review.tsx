import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import CarouselSlider from "@/components/Ui/slider/carousel";
import Img_review from "@/public/images/Img_review.png";

const Review = () => {
  const slides = [
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 5,
    },
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 4,
    },
    {
      title:
        "Jeg fikk raskt vite at jeg kunne bygge drømmehuset mitt uten overraskelser",
      reviewerName: "— Ada Linna Blomkvist",
      position: "Nærsnes, Asker",
      imageSrc: Img_review,
      star: 4,
    },
  ];
  return (
    <>
      <SideSpaceContainer>
        <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
          <h2 className="text-black font-semibold text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px] mb-3 lg:mb-[20px] text-center desktop:tracking-[-1px]">
            Dette sier noen av våre kunder om oss
          </h2>
          <p className="text-center text-secondary font-medium text-sm md:text-base lg:text-lg leading-[21.78px] mb-6 lg:mb-[48px]">
            Roterende sitater fra kunder som har brukt iPlot og er fornøyde med
            tjenesten.
          </p>
          <CarouselSlider slides={slides} />
        </div>
      </SideSpaceContainer>
    </>
  );
};

export default Review;
