import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Button from "@/components/common/button";
import HusmodellFilterSection from "./husmodellFilterSection";
import HusmodellProperty from "./HusmodellProperty";

const HusmodellPropertyPage: React.FC = () => {
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [maxRangeData, setMaxRangeData] = useState<number>(0);
  const [Name, setName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: maxRangeData,
    TypeHusprodusent: [] as string[],
    Tomtetype: [] as string[],
  });
  const [total, setTotal] = useState();

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      window.location.reload();
      sessionStorage.setItem("hasReloaded", "true");
    } else {
      sessionStorage.removeItem("hasReloaded");

      const storedMaxPrice = sessionStorage.getItem("maxHousePrice");
      if (storedMaxPrice) {
        setMaxRangeData(parseInt(storedMaxPrice, 10));
        setFormData((prev) => ({
          ...prev,
          maxRangeForHusmodell: parseInt(storedMaxPrice, 10),
        }));
      }
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
        const queryParams: any = new URLSearchParams(window.location.search);
        const a = queryParams.get("Kommue").replace(/\s*\(\d+\)/, "");
        setName(a);

        const q = query(collection(db, "house_model"));

        const querySnapshot = await getDocs(q);

        const data: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTotal(data.length);
        const soveromValues = formData.AntallSoverom.map((item: any) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );
        const filterData =
          data.filter((house: any) => {
            const housePrice = parseInt(
              house?.Husdetaljer?.pris.replace(/\s/g, ""),
              10
            );

            return (
              (formData.AntallSoverom.length > 0
                ? soveromValues.includes(house?.Husdetaljer?.Soverom)
                : true) &&
              (formData.minRangeForHusmodell !== 0
                ? housePrice >= formData.minRangeForHusmodell
                : true) &&
              housePrice <= Number(formData.maxRangeForHusmodell)
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
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-[#111322] text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Husmodeller</span> i{" "}
              <span className="font-bold text-blue">{Name} Kommune</span>
            </h3>
            {!isLoading && (
              <p className="text-[#111322] text-sm md:text-base desktop:text-xl font-light">
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
                name={Name}
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
              className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
            />
            <Button
              text="Neste"
              className="border border-[#6941C6] bg-[#6941C6] text-white sm:text-base rounded-[50px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[20px] desktop:py-[16px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HusmodellPropertyPage;
