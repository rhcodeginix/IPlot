import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Button from "@/components/common/button";
import HusmodellFilterSection from "./husmodellFilterSection";
import HusmodellProperty from "./HusmodellProperty";
import Link from "next/link";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Image from "next/image";
import PropertyDetail from "../stepperUi/propertyDetail";
import PropertyDetails from "../husmodellPlot/properyDetails";

const HusmodellPropertyPage: React.FC<{
  CadastreDataFromApi: any;
  lamdaDataFromApi: any;
  askData: any;
  handleNext: any;
  handlePrevious: any;
}> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  handleNext,
  handlePrevious,
}) => {
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [maxRangeData, setMaxRangeData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Hustype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: maxRangeData,
  });
  const [total, setTotal] = useState();
  useEffect(() => {
    const storedMaxPrice = sessionStorage.getItem("maxHousePrice");
    if (storedMaxPrice) {
      setMaxRangeData(parseInt(storedMaxPrice, 10));
      setFormData((prev) => ({
        ...prev,
        maxRangeForHusmodell: parseInt(storedMaxPrice, 10),
      }));
    }
  }, []);
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "house_model"))
        );
        const data: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const maxHousePrice = Math.max(
          ...data?.map((house: any) =>
            parseInt(house?.Husdetaljer?.pris.replace(/\s/g, ""), 10)
          )
        );

        sessionStorage.setItem("maxHousePrice", maxHousePrice.toString());
        setMaxRangeData(maxHousePrice);
      } catch (error) {
        console.error("Error fetching max price:", error);
      }
    };

    fetchMaxPrice();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);

      try {
        const q = query(collection(db, "house_model"));

        const querySnapshot = await getDocs(q);

        const data: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTotal(data.length);
        const soveromValues = formData?.AntallSoverom.map((item: any) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );
        const filterData =
          data.filter((house: any) => {
            const housePrice = parseInt(
              house?.Husdetaljer?.pris.replace(/\s/g, ""),
              10
            );

            return (
              (formData?.AntallSoverom.length > 0
                ? soveromValues.includes(house?.Husdetaljer?.Soverom)
                : true) &&
              (formData?.minRangeForHusmodell !== 0
                ? housePrice >= formData?.minRangeForHusmodell
                : true) &&
              housePrice <= Number(formData?.maxRangeForHusmodell) &&
              (formData?.Hustype.length > 0
                ? formData?.Hustype.map((item: any) =>
                    item.toLowerCase()
                  ).includes(house?.Husdetaljer?.TypeObjekt?.toLowerCase())
                : true)
            );
          }) || data;

        setHouseModelProperty(filterData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db, formData, total]);

  return (
    <>
      <div className="bg-lightPurple2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-[#7839EE] text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                handlePrevious();
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
              }}
            >
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Hva kan du bygge?
            </span>
          </div>
          <PropertyDetail
            CadastreDataFromApi={CadastreDataFromApi}
            lamdaDataFromApi={lamdaDataFromApi}
          />
        </SideSpaceContainer>
      </div>
      <PropertyDetails
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
      />
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-darkBlack text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Husmodeller</span> du kan bygge i{" "}
              <span className="font-bold text-blue">
                {
                  CadastreDataFromApi?.presentationAddressApi?.response?.item
                    ?.municipality?.municipalityName
                }{" "}
                Kommune
              </span>
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">{total}</span> annonser
              </p>
            )}
          </div>
          <div className="flex gap-6 relative pb-[56px]">
            <div className="w-[35%]">
              <HusmodellFilterSection
                formData={formData}
                setFormData={setFormData}
                maxRangeData={maxRangeData}
              />
            </div>
            <div className="w-[65%]">
              <HusmodellProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
                handleNext={handleNext}
              />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white p-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          }}
        >
          <div className="flex justify-end items-center gap-6">
            <Button
              text="Tilbake"
              className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
              onClick={() => {
                handlePrevious();
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HusmodellPropertyPage;
