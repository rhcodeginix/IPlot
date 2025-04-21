import Loading from "@/components/Loading";
import NorkartMap from "@/components/map";
import Link from "next/link";

const TomtBakenProperty: React.FC<{
  isLoading: any;
  HouseModelProperty: any;
}> = ({ HouseModelProperty, isLoading }) => {
  return (
    <>
      <div>
        {isLoading ? (
          <div className="relative">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12 w-full">
            {HouseModelProperty?.length > 0 ? (
              HouseModelProperty?.map((property: any, index: number) => (
                <Link
                  key={index}
                  href={`/tomtbaken/property-detail?propertyId=${property?.id}`}
                  className="relative"
                >
                  <div className="flex flex-col cursor-pointer relative z-40">
                    <div>
                      <div className="h-[300px] md:h-[350px] cursor-pointer mb-2">
                        {property?.lamdaDataFromApi?.coordinates
                          ?.convertedCoordinates && (
                          <NorkartMap
                            coordinates={
                              property?.lamdaDataFromApi?.coordinates
                                ?.convertedCoordinates
                            }
                          />
                        )}
                      </div>
                      <h3 className="text-black text-lg font-medium mb-2">
                        {
                          property?.CadastreDataFromApi?.presentationAddressApi
                            ?.response?.item?.formatted?.line1
                        }
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-secondary text-sm">
                        <span className="text-black font-semibold">
                          {property?.lamdaDataFromApi?.eiendomsInformasjon
                            ?.basisInformasjon?.areal_beregnet ? (
                            <>
                              {
                                property?.lamdaDataFromApi?.eiendomsInformasjon
                                  ?.basisInformasjon?.areal_beregnet
                              }{" "}
                              m<sup>2</sup>
                            </>
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Gnr:{" "}
                        <span className="text-black font-semibold">
                          {
                            property?.lamdaDataFromApi?.searchParameters
                              ?.gardsnummer
                          }
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Bnr:{" "}
                        <span className="text-black font-semibold">
                          {
                            property?.lamdaDataFromApi?.searchParameters
                              ?.bruksnummer
                          }
                        </span>
                      </div>
                      <div className="h-[12px] w-[1px] border-l border-gray"></div>
                      <div className="text-secondary text-sm">
                        Snr:{" "}
                        <span className="text-black font-semibold">
                          {property?.getAddress?.bokstav}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute z-50 top-0 left-0 h-full w-full"></div>
                </Link>
              ))
            ) : (
              <p>No Search History found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TomtBakenProperty;
