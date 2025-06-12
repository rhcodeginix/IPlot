// import React, { useEffect, useState } from "react";
// import Plots from "@/components/Ui/Husmodell/plot";
// import SideSpaceContainer from "@/components/common/sideSpace";
// import Link from "next/link";
// import Image from "next/image";
// import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
// import { useRouter } from "next/router";
// import TomtHouseDetails from "./tomtDetail";

// // const Tomt: React.FC<any> = ({
// //   handleNext,
// //   handlePrevious,
// //   HouseModelData,
// // }) => {
// const Tomt: React.FC<{
//   handleNext: any;
//   handlePrevious: any;
//   HouseModelData: any;
//   setLamdaDataFromApi: any;
//   setCadastreDataFromApi: any;
//   setAdditionalData: any;
//   loadingAdditionalData: any;
//   loginUser: any;
//   loadingLamdaData: any;
//   supplierData: any;
//   CadastreDataFromApi: any;
//   askData: any;
//   lamdaDataFromApi: any;
//   user: any;
// }> = ({
//   handleNext,
//   handlePrevious,
//   HouseModelData,
//   // setLamdaDataFromApi,
//   // setCadastreDataFromApi,
//   // setAdditionalData,
//   loadingAdditionalData,
//   loginUser,
//   loadingLamdaData,
//   supplierData,
//   askData,
//   lamdaDataFromApi,
//   user,
//   CadastreDataFromApi,
// }) => {
//   const router = useRouter();

//   const [hasMounted, setHasMounted] = useState(false);
//   const [plotId, setPlotId] = useState<string | null>(null);

//   useEffect(() => {
//     const { plotId: plot } = router.query;
//     if (plot) {
//       setPlotId(String(plot));
//     } else {
//       setPlotId(null);
//     }
//   }, [router.query]);

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   if (!hasMounted) return null;

//   return (
//     <div className="relative">
//       {plotId ? (
//         <TomtHouseDetails
//           handleNext={handleNext}
//           handlePrevious={handlePrevious}
//           loadingAdditionalData={loadingAdditionalData}
//           loginUser={loginUser}
//           loadingLamdaData={loadingLamdaData}
//           supplierData={supplierData}
//           CadastreDataFromApi={CadastreDataFromApi}
//           HouseModelData={HouseModelData}
//           askData={askData}
//           lamdaDataFromApi={lamdaDataFromApi}
//           user={user}
//         />
//       ) : (
//         <>
//           <div className="bg-lightPurple2 py-2 md:py-4">
//             <SideSpaceContainer>
//               <div className="flex items-center gap-1">
//                 <Link
//                   href={"/"}
//                   className="text-[#7839EE] text-xs md:text-sm font-medium"
//                 >
//                   Hjem
//                 </Link>
//                 <Image src={Ic_breadcrumb_arrow} alt="arrow" />
//                 <div
//                   className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
//                   onClick={() => {
//                     const currIndex = 0;
//                     localStorage.setItem("currIndex", currIndex.toString());
//                     handlePrevious();
//                   }}
//                 >
//                   Husmodell
//                 </div>
//                 <Image src={Ic_breadcrumb_arrow} alt="arrow" />
//                 <div
//                   className="text-[#7839EE] text-xs md:text-sm font-medium cursor-pointer"
//                   onClick={() => {
//                     handlePrevious();
//                   }}
//                 >
//                   Tilpass
//                 </div>
//                 <Image src={Ic_breadcrumb_arrow} alt="arrow" />
//                 <span className="text-secondary2 text-xs md:text-sm">Tomt</span>
//               </div>
//             </SideSpaceContainer>
//           </div>
//           <Plots
//             // handleNext={handleNext}
//             handlePrevious={handlePrevious}
//             HouseModelData={HouseModelData}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default Tomt;

import React, { useEffect, useState } from "react";
import Plots from "@/components/Ui/Husmodell/plot";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import SelectPlot from "./selectPlot";
import { useRouter } from "next/router";
import TomtHouseDetails from "./tomtDetail";

const Tomt: React.FC<{
  handleNext: any;
  handlePrevious: any;
  HouseModelData: any;
  setLamdaDataFromApi: any;
  setCadastreDataFromApi: any;
  setAdditionalData: any;
  loadingAdditionalData: any;
  loginUser: any;
  loadingLamdaData: any;
  supplierData: any;
  CadastreDataFromApi: any;
  askData: any;
  lamdaDataFromApi: any;
  user: any;
}> = ({
  handleNext,
  handlePrevious,
  HouseModelData,
  setLamdaDataFromApi,
  setCadastreDataFromApi,
  setAdditionalData,
  loadingAdditionalData,
  loginUser,
  loadingLamdaData,
  supplierData,
  askData,
  lamdaDataFromApi,
  user,
  CadastreDataFromApi,
}) => {
  const router = useRouter();
  // const { kommunenummer } = router.query;
  const [hasMounted, setHasMounted] = useState(false);
  const [plotId, setPlotId] = useState<string | null>(null);
  const [kommunenummer, setKommunenummer] = useState<string | null>(null);

  useEffect(() => {
    const { plotId: plot, kommunenummer: komm } = router.query;
    if (plot) {
      setPlotId(String(plot));
    } else {
      setPlotId(null);
    }
    if (komm) {
      setKommunenummer(String(komm));
    } else {
      setKommunenummer(null);
    }
  }, [router.query]);

  const [isPlot, setIsPlot] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative">
      {plotId || kommunenummer ? (
        <TomtHouseDetails
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          loadingAdditionalData={loadingAdditionalData}
          loginUser={loginUser}
          loadingLamdaData={loadingLamdaData}
          supplierData={supplierData}
          CadastreDataFromApi={CadastreDataFromApi}
          HouseModelData={HouseModelData}
          askData={askData}
          lamdaDataFromApi={lamdaDataFromApi}
          user={user}
        />
      ) : (
        <>
          <div className="bg-lightBlue py-2 md:py-4">
            <SideSpaceContainer>
              <div className="flex items-center gap-1">
                <Link
                  href={"/"}
                  className="text-primary text-xs md:text-sm font-bold"
                >
                  Hjem
                </Link>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Hyttemodell
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    handlePrevious();
                  }}
                >
                  Tilpass
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
                <span className="text-secondary2 text-xs md:text-sm">Tomt</span>
              </div>
            </SideSpaceContainer>
          </div>
          {isPlot ? (
            <Plots
              // handleNext={handleNext}
              handlePrevious={handlePrevious}
              HouseModelData={HouseModelData}
              setLamdaDataFromApi={setLamdaDataFromApi}
              setCadastreDataFromApi={setCadastreDataFromApi}
              setAdditionalData={setAdditionalData}
            />
          ) : (
            <SelectPlot
              HouseModelData={HouseModelData}
              setIsPlot={setIsPlot}
              handleNext={handleNext}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Tomt;
