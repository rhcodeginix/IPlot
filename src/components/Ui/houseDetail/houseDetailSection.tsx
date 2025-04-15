import Image from "next/image";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import Loader from "@/components/Loader";

const HouseDetailsection: React.FC<{
  loading: any;
  HouseModelData: any;
}> = ({ loading, HouseModelData }) => {
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div
        className="py-5"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F,0px 1px 3px 0px #1018281A",
        }}
      >
        <SideSpaceContainer>
          <div className="flex gap-[16px] justify-between">
            <div className="w-[20%] flex items-start gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever
                </p>
                <p className="text-black text-base font-medium">
                  ferdig regulert til boligformål
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-start gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever
                </p>
                <p className="text-black text-base font-medium">
                  {HouseModelData?.Husdetaljer?.Tomtetype}
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-start gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever
                </p>
                <p className="text-black text-base font-medium">
                  Mønehøyde på {HouseModelData?.Husdetaljer?.Mønehøyde} meter
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-start gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever
                </p>
                <p className="text-black text-base font-medium">
                  Gesimshøyde på {HouseModelData?.Husdetaljer?.Gesimshøyde}{" "}
                  meter
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-start gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever en
                </p>
                <p className="text-black text-base font-medium">
                  Grunnflate på {HouseModelData?.Husdetaljer?.Bruksareal}
                </p>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HouseDetailsection;
