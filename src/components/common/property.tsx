import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const Property: React.FC<any> = ({ propertyList, LinkHref }) => {
  const [supplierData, setSupplierData] = useState<{ [key: string]: any }>({});

  const getData = async (supplierId: string) => {
    try {
      const supplierDocRef = doc(db, "suppliers", supplierId);
      const docSnap: any = await getDoc(supplierDocRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No document found for ID:", supplierId);
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap: { [key: string]: any } = {};

      await Promise.all(
        propertyList.map(async (property: any) => {
          const supplierId = property?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            supplierMap[supplierId] = await getData(supplierId);
          }
        })
      );

      setSupplierData(supplierMap);
    };

    fetchSupplierDetails();
  }, [propertyList]);

  return (
    <>
      {propertyList.map((property: any, index: any) => {
        const supplierId = property?.Husdetaljer?.Leverandører;
        const data = supplierData[supplierId] || null;
        return (
          <Link
            key={index}
            href={`${LinkHref}&husodellId=${property.id}`}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="relative mb-4">
                <img
                  src={property?.Husdetaljer?.photo}
                  alt="product-image"
                  className="w-full rounded-[12px] overflow-hidden h-[184px] object-cover"
                />
                <div className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[106px] h-[33px]">
                  <img
                    src={data?.photo}
                    alt="product-logo"
                    className="w-[82px] h-[17px]"
                  />
                </div>
                <div className="absolute bottom-[12px] right-[12px] rounded-[8px] w-[74px] h-[74px] bg-white">
                  <img
                    src={property?.Husdetaljer?.PlantegningerFasader[0]}
                    alt="product-map"
                    className="p-1.5 h-full w-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-black text-lg font-medium mb-2">
                {property?.Husdetaljer?.husmodell_name}
              </h3>
              <div className="gap-4 flex items-center mb-4">
                <p className="text-secondary text-sm">Pris fra</p>
                <h5 className="text-black text-base font-semibold">
                  {property?.Husdetaljer?.pris}
                </h5>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {property?.Husdetaljer?.BRATotal}
                </span>{" "}
                m<sup>2</sup>
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {property?.Husdetaljer?.Soverom}
                </span>{" "}
                soverom
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-secondary text-sm">
                <span className="text-black font-semibold">
                  {property?.Husdetaljer?.Bad}
                </span>{" "}
                bad
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default Property;
