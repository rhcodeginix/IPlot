import React from "react";
import { useAddress } from "@/context/addressContext";
import Ic_Step_icon from "@/public/images/Ic_Step_icon.svg";
import GoogleMapComponent from "../map";
import Image from "next/image";

const PropertyDetail: React.FC<any> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
}) => {
  const { getAddress } = useAddress();

  return (
    <>
      <div className="bg-lightPurple flex flex-col laptop:flex-row laptop:items-center gap-4 laptop:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 sm:items-center">
          <div className="rounded-[12px] overflow-hidden w-full sm:w-[132px] h-[200px] sm:h-[100px]">
            <GoogleMapComponent
              coordinates={lamdaDataFromApi?.coordinates?.convertedCoordinates}
            />
          </div>
          <div>
            <h2 className="text-darkBlack font-medium text-base md:text-xl lg:text-2xl lg:leading-[30px] mb-1 md:mb-2 one_line_elipse">
              {
                CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line1
              }{" "}
              <span className="font-medium">
                (
                {
                  CadastreDataFromApi?.presentationAddressApi?.response?.item
                    ?.municipality?.municipalityName
                }
                ) Kommune
              </span>
            </h2>
            <p className="text-secondary2 text-sm md:text-base desktop:text-lg">
              {
                CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line2
              }
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start laptop:items-end">
          <div className="flex items-center gap-4 mb-2 md:mb-3">
            <div className="flex items-center gap-4">
              <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                Gnr:{" "}
                <span className="text-black font-semibold">
                  {lamdaDataFromApi?.searchParameters?.gardsnummer}
                </span>
              </div>
              <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                Bnr:{" "}
                <span className="text-black font-semibold">
                  {lamdaDataFromApi?.searchParameters?.bruksnummer}
                </span>
              </div>
              <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                Snr:{" "}
                <span className="text-black font-semibold">
                  {getAddress?.bokstav}
                </span>
              </div>
              <div className="h-[12px] border-l border-[#5D6B98]"></div>
              <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                moh.{" "}
                <span className="text-black font-semibold">
                  {getAddress?.representasjonspunkt &&
                    getAddress?.representasjonspunkt.lat
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 sm:gap-2 rounded-[50px] bg-[#EDFCF2] py-2 px-3 whitespace-normal">
            <Image src={Ic_Step_icon} alt="icon" className="w-4 sm:w-auto" />
            <div className="text-black text-xs md:text-sm lg:text-base whitespace-normal">
              <span className="font-bold">Tomten</span> er i samsvar med alle
              reguleringsbestemmelser.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
