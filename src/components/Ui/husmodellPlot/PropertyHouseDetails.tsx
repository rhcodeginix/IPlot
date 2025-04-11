import Image from "next/image";
import Ic_Step_icon from "@/public/images/Ic_Step_icon.svg";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/router";
import { formatCurrency } from "../RegulationHusmodell/Illustrasjoner";
import { useCustomizeHouse } from "@/context/selectHouseContext";

const PropertyHouseDetails: React.FC<{
  HouseModelData: any;
  lamdaDataFromApi: any;
  supplierData: any;
  pris?: any;
}> = ({ HouseModelData, lamdaDataFromApi, supplierData, pris }) => {
  const router = useRouter();
  const leadId = router.query["leadId"];
  const Husdetaljer = HouseModelData?.Husdetaljer;
  const [kommune, setKommune] = useState<any>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const cityQuery = queryParams.get("Kommue");
    setKommune(cityQuery);
  }, []);
  const [equityAmount, setEquityAmount] = useState<any>(null);

  const { customizeHouse: custHouse } = useCustomizeHouse();

  const totalCustPris = custHouse
    ? custHouse?.reduce(
        (sum: any, item: any) =>
          sum + Number(item?.product?.pris.replace(/\s/g, "")),
        0
      )
    : 0;

  useEffect(() => {
    (async () => {
      try {
        const docSnap = await getDoc(doc(db, "leads", String(leadId)));

        if (docSnap.exists()) {
          const data = docSnap.data();

          const value = data?.bankValue;
          setEquityAmount(value?.equityAmount);
        }
      } catch (error) {
        console.error("Error fetching IsoptForBank status:", error);
      }
    })();
  }, [leadId, equityAmount]);
  const husPris = Number(Husdetaljer?.pris?.replace(/\s/g, "")) || 0;
  const extraPris = Number(pris) || 0;

  const totalPrice =
    Number(totalCustPris) + Number(husPris) + Number(extraPris);

  return (
    <>
      <div className="pb-4 flex items-center gap-4 justify-between">
        <div className="flex gap-3 items-center w-max">
          <div className="relative">
            <img
              src={HouseModelData?.Husdetaljer?.photo}
              alt="image"
              className="w-[190px] object-cover rounded-lg"
            />
            <img
              src={supplierData?.photo}
              alt="image"
              className="absolute top-[6px] left-[6px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[100px]"
            />
          </div>
          <div className="w-max">
            <h4 className="text-darkBlack font-medium text-base md:text-xl lg:text-2xl lg:leading-[30px] mb-2 one_line_elipse">
              <span className="font-bold">
                {HouseModelData?.Husdetaljer?.husmodell_name}
              </span>{" "}
              fra{" "}
              <span className="font-bold">{supplierData?.company_name}</span>{" "}
              bygget i{" "}
              <span className="font-bold">
                {kommune ||
                  lamdaDataFromApi?.eiendomsInformasjon?.kommune_info
                    ?.kommune}{" "}
                Kommune
              </span>
            </h4>
            {lamdaDataFromApi && (
              <div className="flex items-center gap-4 mb-2">
                {lamdaDataFromApi?.searchParameters?.gardsnummer && (
                  <div className="text-secondary text-base">
                    Gnr:{" "}
                    <span className="text-black font-semibold">
                      {lamdaDataFromApi.searchParameters.gardsnummer}
                    </span>
                  </div>
                )}
                {lamdaDataFromApi?.searchParameters?.bruksnummer && (
                  <div className="text-secondary text-base">
                    Bnr:{" "}
                    <span className="text-black font-semibold">
                      {lamdaDataFromApi.searchParameters.bruksnummer}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-[50px] bg-[#EDFCF2] py-2 px-3 w-max">
              <Image src={Ic_Step_icon} alt="icon" />
              <div className="text-black text-base">
                <span className="font-bold">
                  {HouseModelData?.Husdetaljer?.husmodell_name || "Modellen"}
                </span>{" "}
                er i samsvar med alle reguleringsbestemmelser.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 w-max">
          <div>
            <p className="text-secondary text-sm mb-2">Dine tillegg</p>
            <h4 className="text-darkBlack font-semibold text-xl">
              {totalCustPris
                ? formatCurrency(totalCustPris.toLocaleString("nb-NO"))
                : "0 NOK"}
            </h4>
          </div>
          <div>
            <p className="text-secondary text-sm mb-2">Din pris med tilvalg</p>
            <h4 className="text-darkBlack font-semibold text-xl">
              {formatCurrency(totalPrice.toLocaleString("nb-NO"))}
            </h4>

            <p className="text-secondary text-sm mb-2">
              + tomtepris ({formatCurrency(husPris.toLocaleString("nb-NO"))})
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyHouseDetails;
