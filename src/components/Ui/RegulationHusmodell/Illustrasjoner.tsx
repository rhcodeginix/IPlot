import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Ic_close from "@/public/images/Ic_close.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Modal from "@/components/common/modal";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";

export function formatCurrency(nokValue: number | string) {
  const number =
    typeof nokValue === "string"
      ? Number(nokValue.replace(/\s/g, ""))
      : Number(nokValue);

  return (
    new Intl.NumberFormat("de-DE", { style: "decimal" }).format(number) + " NOK"
  );
}

const Illustrasjoner: React.FC = () => {
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<any>(null);
  const husmodellData = finalData?.Husdetaljer;
  const router = useRouter();
  const id = router.query["husodellId"];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [husmodellData?.OmHusmodellen]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(id));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [isOpen, setIsOpen] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<"single" | "gallery">("single");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const images = finalData?.Husdetaljer?.photo3D || [];

  const displayedImages = images.slice(0, 6);
  const extraImagesCount = images.length - 6;

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setPopupMode("single");
    setIsPopupOpen(true);
  };

  const handleGalleryClick = () => {
    setPopupMode("gallery");
    setIsPopupOpen(true);
  };
  return (
    <div className="relative">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="border border-[#DCDFEA] rounded-lg overflow-hidden">
            <button
              className={`bg-white flex justify-between items-center w-full p-2 sm:p-3 md:p-5 duration-1000 ${isOpen ? "active" : ""}`}
              onClick={toggleAccordion}
            >
              <span className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold one_line_elipse">
                Bilder av {husmodellData?.husmodell_name}
              </span>
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                <div className="text-secondary2 text-xs md:text-sm one_line_elipse">
                  pris fra :{" "}
                  <span className="text-black font-medium text-sm md:text-base">
                    {formatCurrency(husmodellData?.pris)}
                  </span>
                </div>
                {isOpen ? (
                  <Image src={Ic_chevron_up} alt="arrow" fetchPriority="auto" />
                ) : (
                  <Image
                    src={Ic_chevron_down}
                    alt="arrow"
                    fetchPriority="auto"
                    className="w-5 h-5 md:w-auto md:h-auto"
                  />
                )}
              </div>
            </button>
            <div
              className={`overflow-hidden max-h-0 ${isOpen ? "p-4 md:p-5 border-t border-[#DCDFEA]" : ""}`}
              style={{
                maxHeight: isOpen ? "max-content" : "0",
                transition: "max-height 0.2s ease-out",
              }}
            >
              <div
                className={`gap-4 lg:gap-6 flex flex-col lg:flex-row ${displayedImages.length < 4 ? "md:h-[400px]" : "md:h-[500px]"}`}
              >
                <div
                  className={`w-full grid gap-4 md:gap-6 grid-cols-3
      ${displayedImages.length < 4 ? "grid-rows-1" : "grid-rows-2"}
    `}
                >
                  {displayedImages.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="relative overflow-hidden h-full cursor-pointer"
                      onClick={() => {
                        if (index === 5 && extraImagesCount > 0) {
                          handleGalleryClick();
                        } else {
                          handleImageClick(image);
                        }
                      }}                    >
                      <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-fill rounded-lg"
                      />

                      {index === 5 && extraImagesCount > 0 && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg"
                        >
                          +{extraImagesCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
     {isPopupOpen && (
        <Modal isOpen={true} onClose={() => setIsPopupOpen(false)}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsPopupOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            {popupMode === "single" && selectedImage && (
              <div className="flex justify-center items-center h-[500px]">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {popupMode === "gallery" && (
              <div className="grid grid-cols-3 gap-2 my-4">
                {images.map((image: any, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt="product"
                    className="w-full h-[200px] object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Illustrasjoner;
