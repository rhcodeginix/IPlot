import Loader from "@/components/Loader";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/propertyDetailPage";
import Tabs from "@/components/Ui/tabnav";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Husdetaljer from "./Husdetaljer";
import Prisliste from "./Prisliste";
import SideSpaceContainer from "@/components/common/sideSpace";

const HusmodellDetail = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [{ label: "Husdetaljer" }, { label: "Prisliste" }];

  const [id, setId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [husmodellData, setHusmodellData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setId(queryParams.get("husmodell"));
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", id);
        const docSnap = await getDoc(husmodellDocRef);

        if (docSnap.exists()) {
          setHusmodellData(docSnap.data());
        } else {
          console.error("No document found for ID:", id);
        }
      } catch (error) {
        console.error("Error fetching husmodell data:", error);
      }
      setLoading(false);
    };

    getData();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-lightPurple py-4">
            <SideSpaceContainer>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-4 items-center">
                  <img
                    src={husmodellData?.Husdetaljer?.photo}
                    alt="plot-image"
                    className="w-[180px] h-[113px] rounded-lg"
                  />
                  <div className="flex flex-col gap-4">
                    <h4 className="text-black font-medium text-2xl">
                      {husmodellData?.Husdetaljer?.husmodell_name}
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-lg text-black font-semibold">
                        {husmodellData?.Husdetaljer?.BRATotal}{" "}
                        <span className="text-secondary font-normal">
                          m<sup>2</sup>
                        </span>
                      </div>
                      <div className="h-3 border-l border-gray2"></div>
                      <div className="text-lg text-black font-semibold">
                        {husmodellData?.Husdetaljer?.Soverom}{" "}
                        <span className="text-secondary font-normal">
                          soverom
                        </span>
                      </div>
                      <div className="h-3 border-l border-gray2"></div>
                      <div className="text-lg text-black font-semibold">
                        {husmodellData?.Husdetaljer?.Bad}{" "}
                        <span className="text-secondary font-normal">bad</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-secondary text-sm">Pris fra</p>
                  <h5 className="text-black text-xl font-semibold">
                    {formatCurrency(husmodellData?.Husdetaljer?.pris)}
                  </h5>
                </div>
              </div>
            </SideSpaceContainer>
          </div>
          <div className="pt-[44px] pb-[72px]">
            <SideSpaceContainer>
              <div className="border-b border-gray2 flex items-center justify-between gap-2 mb-6">
                <Tabs
                  tabs={tabData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
              {activeTab === 0 && (
                <Husdetaljer husmodellData={husmodellData?.Husdetaljer} />
              )}
              {activeTab === 1 && (
                <Prisliste
                  husmodellData={husmodellData?.Prisliste}
                  loading={loading}
                />
              )}
            </SideSpaceContainer>
          </div>
        </>
      )}
    </>
  );
};

export default HusmodellDetail;
