import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import Ic_Check_white from "@/public/images/Ic_Check_white.svg";

interface Step {
  name: string;
  component: any;
}

interface StepperProps {
  steps: Step[];
  currIndex: any;
  setCurrIndex: any;
  Style?: any;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currIndex,
  setCurrIndex,
  Style,
}) => {
  const stepRefs = useRef<any>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && currIndex) {
      localStorage.setItem("currIndex", currIndex.toString());
    }
    const currentStepEl = stepRefs.current[currIndex];
    if (currentStepEl) {
      currentStepEl.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }, [currIndex]);

  const handleStepClick = (index: number) => {
    if (index <= currIndex) {
      setCurrIndex(index);
    }
    localStorage.setItem("currIndex", index.toString());
  };

  return (
    <>
      <>
        <div className="py-3 bg-[#491C96]">
          <SideSpaceContainer>
            <div className="stepper_main overFlowScrollHidden">
              <div className="stepper-wrapper">
                <div className="progress"></div>
                {steps.map((step, index) => (
                  <div
                    key={index}
                    ref={(el: any) => (stepRefs.current[index] = el)}
                    className={`screen-indicator-span cursor-pointer ${
                      index < currIndex
                        ? "completed"
                        : index === currIndex
                          ? "current"
                          : ""
                    }`}
                    onClick={() => handleStepClick(index)}
                    style={{
                      color: index === currIndex ? "#2a343e" : "",
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 md:gap-2 px-1 md:px-2 bg-[#491C96]"
                      style={{ zIndex: 2 }}
                    >
                      {index < currIndex ? (
                        <div className="w-6 h-6 bg-[#099250] flex items-center justify-center rounded-full">
                          <Image src={Ic_Check_white} alt="Completed" />
                        </div>
                      ) : (
                        <span className="screen-index">{index + 1}</span>
                      )}
                      <span>{step.name}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`screen-indicator ${Style && "screen-more"} ${
                          index < currIndex
                            ? "completed"
                            : index === currIndex
                              ? "current"
                              : ""
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SideSpaceContainer>
        </div>

        <div className="active_page">
          {steps[currIndex]?.component || <div>Unknown step</div>}
        </div>
      </>
    </>
  );
};

export default Stepper;
