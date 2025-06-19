"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import NorkartMap from "@/components/map";
import { auth, db } from "@/config/firebaseConfig";
import { useAddress } from "@/context/addressContext";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const index = () => {
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setStoreAddress } = useAddress();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userUID = user.uid;
        const propertiesCollectionRef = collection(
          db,
          "users",
          userUID,
          "property"
        );
        try {
          const propertiesSnapshot = await getDocs(propertiesCollectionRef);
          const fetchedProperties: any = propertiesSnapshot.docs.map((doc) => ({
            propertyId: doc.id,
            ...doc.data(),
          }));
          setUserProperties(fetchedProperties);
        } catch (error) {
          console.error("Error fetching user's properties:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-[44px] pb-[66px]">
      <SideSpaceContainer>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
            {Array.from({ length: 8 }).map((_: any, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col gap-3 cursor-pointer relative z-40">
                  <div className="h-[300px] md:h-[350px] cursor-pointer">
                    <div className="w-full h-full rounded-lg custom-shimmer"></div>
                  </div>

                  <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
                </div>
                <div className="absolute z-50 top-0 left-0 h-full w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
            {userProperties.length > 0 ? (
              userProperties.map((property: any, index) => (
                <Link
                  key={index}
                  href={`/regulations?propertyId=${property?.propertyId}`}
                  className="relative"
                  onClick={() => {
                    // localStorage.setItem(
                    //   "IPlot_Address",
                    //   JSON.stringify(property?.getAddress)
                    // );
                    setStoreAddress(property?.getAddress);
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                  }}
                >
                  <div className="flex flex-col gap-3 cursor-pointer relative z-40">
                    <div className="h-[300px] md:h-[350px] cursor-pointer">
                      {property?.lamdaDataFromApi?.coordinates
                        ?.convertedCoordinates && (
                        <NorkartMap
                          coordinates={
                            property?.lamdaDataFromApi?.coordinates
                              ?.convertedCoordinates
                          }
                          MAX_ZOOM={20}
                        />
                      )}
                    </div>
                    <h4 className="text-black font-medium text-base lg:text-lg">
                      {property?.getAddress?.adressetekst}
                    </h4>
                  </div>
                  <div className="absolute z-50 top-0 left-0 h-full w-full"></div>
                </Link>
              ))
            ) : (
              <p>No Search History found.</p>
            )}
          </div>
        )}
      </SideSpaceContainer>
    </div>
  );
};

export default index;
