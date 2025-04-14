import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";

const Analysis = () => {
  return (
    <>
      <div className="bg-lightGreen pt-[44px] md:pt-[58px] desktop:pt-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black font-semibold text-[20px] md:text-[28px] lg:text-[32px] desktop:text-[48px] desktop:leading-[56px]  mb-3 lg:mb-[20px] text-center tracking-[-1px]">
            Nærhet og nabolagsanalyse
          </h2>
          <p className="text-center text-secondary text-sm md:text-base lg:text-lg lg:leading-[30px] mb-6 lg:mb-[48px] desktop:mb-[60px]">
            Med MinTomt får du mer enn bare tomteanalyse – vi gir deg en
            detaljert oversikt over nabolaget. Se nærhet til skoler,{" "}
            <br className="hidden lg:block" />
            kollektivtilbud, butikker og barnehager, og få et klart bilde av
            hvordan det er å bo der, allerede fra første klikk.
          </p>
        </SideSpaceContainer>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d128084.03975434699!2d10.620313966726611!3d59.89375210057153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e61f267f039%3A0x7e92605fd3231e9a!2sOslo%2C%20Norway!5e0!3m2!1sen!2sin!4v1731662674651!5m2!1sen!2sin"
          width="100%"
          style={{ border: "0" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[500px] lg:h-[690px]"
        ></iframe>
      </div>
    </>
  );
};

export default Analysis;
