import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Ic_close from "@/public/images/Ic_close.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";
import Modal from "@/components/common/modal";
import Ic_download_primary from "@/public/images/Ic_download.svg";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import FileInfo from "@/components/FileInfo";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { File } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function formatCurrency(nokValue: number | string) {
  const number =
    typeof nokValue === "string"
      ? Number(nokValue.replace(/\s/g, ""))
      : Number(nokValue);

  return (
    new Intl.NumberFormat("de-DE", { style: "decimal" }).format(number) + " NOK"
  );
}

const handleDownload = async (filePath: string) => {
  try {
    if (!filePath) {
      console.error("File path is missing!");
      return;
    }

    const storage = getStorage();
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = filePath.split("/").pop() || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

const Illustrasjoner: React.FC = () => {
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const textareaRef = useRef<any>(null);
  const husmodellData = finalData?.Husdetaljer;
  const router = useRouter();
  const id = router.query["husmodellId"];

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

    if (id) {
      fetchData();
    }
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

  const popup = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
                className={`gap-4 lg:gap-6 flex flex-col desktop:flex-row ${displayedImages.length < 4 ? "md:h-[400px]" : "md:h-[500px]"}`}
              >
                <div
                  className={`w-full ${
                    husmodellData?.documents &&
                    husmodellData?.documents.length > 0
                      ? "desktop:w-2/3"
                      : "desktop:w-full"
                  } grid gap-4 md:gap-6 grid-cols-3
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
                      }}
                    >
                      <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-cover rounded-lg"
                      />

                      {index === 5 && extraImagesCount > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center text-white text-base font-bold cursor-pointer rounded-lg">
                          +{extraImagesCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {husmodellData?.documents &&
                  husmodellData?.documents.length > 0 && (
                    <div className="w-full desktop:w-1/3 border border-gray2 shadow-shadow2 rounded-lg h-full">
                      <div className="px-3 md:px-4 py-3 md:py-5 border-b border-gray2 text-darkBlack text-sm md:text-base font-semibold">
                        Dokumenter
                      </div>
                      <div className="p-3 md:p-4 flex flex-col gap-2.5 md:gap-4 overflow-y-auto desktop:h-[calc(100%-65px)] overFlowAutoY">
                        {husmodellData?.documents.map(
                          (doc: any, index: number) => {
                            return (
                              <div
                                className="border border-gray2 rounded-lg p-2 md:p-3 bg-[#F9FAFB] flex items-center justify-between"
                                key={index}
                              >
                                <div className="flex items-start gap-2 md:gap-3 truncate">
                                  <div className="border-[4px] border-lightPurple rounded-full flex items-center justify-center">
                                    <div className="bg-darkPurple w-6 md:w-7 h-6 md:h-7 rounded-full flex justify-center items-center">
                                      <File className="text-primary w-4 h-4" />
                                    </div>
                                  </div>
                                  <FileInfo file={doc} />
                                </div>
                                <Image
                                  src={Ic_download_primary}
                                  alt="download"
                                  className="cursor-pointer w-5 h-5 md:w-6 md:h-6"
                                  onClick={() => handleDownload(doc)}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
      {isPopupOpen && (
        <Modal isOpen={true} onClose={() => setIsPopupOpen(false)}>
          <div
            className="bg-white p-2 md:p-6 rounded-lg max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-4xl mx-4 w-full relative"
            ref={popup}
          >
            <button
              className="absolute top-3 right-0 md:right-3"
              onClick={() => setIsPopupOpen(false)}
            >
              <Image src={Ic_close} alt="close" />
            </button>

            {popupMode === "single" && selectedImage && (
              <div className="flex justify-center items-center w-[400px] h-[400px] my-4 relative">
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
                  onClick={() => {
                    const previousIndex =
                      (images.indexOf(selectedImage) - 1 + images.length) %
                      images.length;
                    setSelectedImage(images[previousIndex]);
                  }}
                >
                  &lt;
                </button>

                <img
                  src={selectedImage}
                  alt="Selected"
                  className="h-full w-full object-cover"
                />

                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
                  onClick={() => {
                    const nextIndex =
                      (images.indexOf(selectedImage) + 1) % images.length;
                    setSelectedImage(images[nextIndex]);
                  }}
                >
                  &gt;
                </button>
              </div>
            )}

            {popupMode === "gallery" && (
              <div className="my-4 galleryImage">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={3}
                  breakpoints={{
                    280: {
                      slidesPerView: 1,
                    },
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  navigation={images.length > 1}
                  modules={[Navigation, Pagination]}
                  className="custom-swiper w-full h-[200px] relative"
                  pagination={
                    images.length > 1
                      ? {
                          el: ".swiper-pagination",
                          clickable: true,
                        }
                      : false
                  }
                >
                  {images.map((image: any, index: number) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-pagination"></div>
                </Swiper>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Illustrasjoner;
