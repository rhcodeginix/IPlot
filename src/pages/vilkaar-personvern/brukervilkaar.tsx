"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";

const Brukervilkaar = () => {
  return (
    <div>
      <div className="bg-lightBlue py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Brukervilkaar
            </span>
          </div>
          <h3 className="text-black font-semibold text-lg md:text-2xl desktop:text-[30px]">
            Brukervilkaar
          </h3>
        </SideSpaceContainer>
      </div>
      <div className="pt-8 pb-32">
        <SideSpaceContainer>
          <p className="text-secondary text-sm md:text-base desktop:text-lg mb-6">
            Welcome to Mintomt. These Terms of Use (“Terms”) govern your access
            to and use of our website{" "}
            <a
              href="https://www.mintomt.no"
              className="underline text-primary font-medium"
            >
              https://www.mintomt.no
            </a>{" "}
            (“Site”). By accessing or using the Site, you agree to be bound by
            these Terms. If you do not agree to these Terms, please do not use
            the Site.
          </p>
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                1. Acceptance of Terms
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                By using this Site, you confirm that you are at least 18 years
                old or accessing the Site under the supervision of a parent or
                legal guardian.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                2. Use of the Site
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                You agree to use the Site only for lawful purposes and in
                accordance with these Terms. You must not:
              </p>
              <ul className="list-disc pl-4">
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Violate any applicable local, national, or international laws
                  or regulations.
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Transmit any unauthorized advertising or promotional materials
                  (spam).
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Attempt to gain unauthorized access to the Site, other
                  accounts, or systems.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                3. Intellectual Property
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                All content on the Site, including text, images, logos, and
                software, is the property of Mintomt or its licensors and is
                protected by copyright and other laws. You may not reproduce,
                distribute, or modify any content without prior written
                permission.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                4. User Accounts
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                If you create an account on our Site, you are responsible for
                maintaining the confidentiality of your login information and
                for all activities under your account.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                5. Limitation of Liability
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                We make no warranties or guarantees about the accuracy or
                completeness of the Site’s content. To the fullest extent
                permitted by law, we disclaim all liability for any loss or
                damage arising from your use of the Site.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                6. Termination
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                We may suspend or terminate your access to the Site at any time,
                without notice, if we believe you have violated these Terms.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                7. Changes to Terms
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                We reserve the right to update these Terms at any time. Changes
                will be posted on this page, and your continued use of the Site
                means you accept the updated Terms.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                8. Contact
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                If you have any questions about these Terms, please contact us
                at: <br /> 📧 [Insert email address] <br /> 📞 [Insert phone
                number]
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Brukervilkaar;
