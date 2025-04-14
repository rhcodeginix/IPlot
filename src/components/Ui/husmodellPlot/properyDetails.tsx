import Image from "next/image";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import SideSpaceContainer from "@/components/common/sideSpace";

const PropertyDetails: React.FC<{
  CadastreDataFromApi: any;
  lamdaDataFromApi: any;
  askData: any;
}> = ({ CadastreDataFromApi, lamdaDataFromApi, askData }) => {
  return (
    <>
      <div
        className="py-5"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F,0px 1px 3px 0px #1018281A",
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-wrap md:flex-nowrap gap-4 lg:gap-5 laptop:gap-[70px] justify-between">
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs lg:text-sm">
                  Eiendommen er
                </p>
                <p className="text-black text-sm lg:text-base font-semibold">
                  ferdig regulert til boligformål
                </p>
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs lg:text-sm">
                  Eiendommen har en
                </p>
                <p className="text-black text-sm lg:text-base font-semibold">
                  Utnyttelsesgrad på{" "}
                  {askData?.bya_calculations?.input?.bya_percentage}%
                </p>
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs lg:text-sm">
                  Ekisterende BYA
                </p>
                <p className="text-black text-sm lg:text-base font-semibold">
                  Utnyttelsesgrad på{" "}
                  {(() => {
                    const data =
                      CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                        (item: any) => item?.builtUpArea
                      ) ?? [];

                    if (
                      lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                        ?.areal_beregnet
                    ) {
                      const totalData = data
                        ? data.reduce(
                            (acc: number, currentValue: number) =>
                              acc + currentValue,
                            0
                          )
                        : 0;

                      const result =
                        (totalData /
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet) *
                        100;
                      const formattedResult = result.toFixed(2);

                      return `${formattedResult}  %`;
                    } else {
                      return "0";
                    }
                  })()}
                </p>
                <p className="text-black text-xs lg:text-sm">
                  Tilgjengelig BYA{" "}
                  {(() => {
                    const data =
                      CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                        (item: any) => item?.builtUpArea
                      ) ?? [];

                    if (askData?.bya_calculations?.results?.total_allowed_bya) {
                      const totalData = data
                        ? data.reduce(
                            (acc: number, currentValue: number) =>
                              acc + currentValue,
                            0
                          )
                        : 0;

                      const result =
                        (totalData /
                          lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet) *
                        100;
                      const formattedResult: any = result.toFixed(2);

                      return `${(
                        askData?.bya_calculations?.input?.bya_percentage -
                        formattedResult
                      ).toFixed(2)} %`;
                    } else {
                      return "0";
                    }
                  })()}
                </p>
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs lg:text-sm">
                  Boligen kan ha en
                </p>
                <p className="text-black text-sm lg:text-base font-semibold">
                  Grunnflate på{" "}
                  {askData?.bya_calculations?.results?.available_building_area}{" "}
                  m<sup>2</sup>
                </p>
                <p className="text-black text-xs lg:text-sm">
                  Tilgjengelig{" "}
                  {(() => {
                    const data =
                      CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                        (item: any) => item?.builtUpArea
                      ) ?? [];

                    if (askData?.bya_calculations?.results?.total_allowed_bya) {
                      const totalData = data
                        ? data.reduce(
                            (acc: number, currentValue: number) =>
                              acc + currentValue,
                            0
                          )
                        : 0;

                      return (
                        <>
                          {(
                            askData?.bya_calculations?.results
                              ?.total_allowed_bya - totalData
                          ).toFixed(2)}
                          m<sup>2</sup>
                        </>
                      );
                    } else {
                      return "0";
                    }
                  })()}
                </p>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default PropertyDetails;
