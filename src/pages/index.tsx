"use client";
import React from "react";
import MainSection from "./homepage/mainSection";
// import HouseCabinMould from "./homepage/houseCabinMould";
import HowItWorks from "./homepage/howItWorks";
import Advantages from "./homepage/advantages";
import Analysis from "./homepage/analysis";
import OurPartners from "./homepage/ourPartners";
import Footer from "@/components/Ui/footer";

const index = () => {
  return (
    <div className="relative">
      <MainSection />
      {/* <HouseCabinMould /> */}
      <HowItWorks />
      <OurPartners />
      <Advantages />
      <Analysis />
      <Footer />
    </div>
  );
};

export default index;
