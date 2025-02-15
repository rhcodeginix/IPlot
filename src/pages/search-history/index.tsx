"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Loader from "@/components/Loader";
import GoogleMapComponent from "@/components/Ui/map";
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
          <div className="h-screen">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-8 gap-y-12">
            {userProperties.length > 0 ? (
              userProperties.map((property: any, index) => (
                <Link
                  key={index}
                  href={`/regulations?propertyId=${property?.propertyId}`}
                  // href={`/regulations?kommunenummer=${property?.getAddress?.kommunenummer}&gardsnummer=${property?.getAddress?.gardsnummer}&bruksnummer=${property?.getAddress?.bruksnummer}&kommunenavn=${property?.getAddress?.kommunenavn}`}
                  className="relative"
                  onClick={() => {
                    localStorage.setItem(
                      "IPlot_Address",
                      JSON.stringify(property?.getAddress)
                    );
                    setStoreAddress(property?.getAddress);
                  }}
                >
                  <div className="flex flex-col gap-3 cursor-pointer relative z-40">
                    <div className="h-[350px] cursor-pointer">
                      <GoogleMapComponent
                        coordinates={
                          property?.lamdaDataFromApi?.coordinates
                            ?.convertedCoordinates
                        }
                      />
                    </div>
                    <h4 className="text-black font-medium text-lg">
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
