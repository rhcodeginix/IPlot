import React from "react";
import HusmodellPropertyPage from "@/components/Ui/regulation";

const Husmodell: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
  handlePrevious,
}) => {
  return (
    <div className="relative">
      <HusmodellPropertyPage
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    </div>
  );
};

export default Husmodell;
