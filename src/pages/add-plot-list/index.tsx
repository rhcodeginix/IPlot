"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Loader from "@/components/Loader";
import NorkartMap from "@/components/map";
import { auth, db } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const index = () => {
  const [userAddPlot, setUserAddPlot] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userUID = user.uid;
        const propertiesCollectionRef = collection(
          db,
          "users",
          userUID,
          "add_plot"
        );
        try {
          const propertiesSnapshot = await getDocs(propertiesCollectionRef);
          const fetchedProperties: any = propertiesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserAddPlot(fetchedProperties);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-4 gap-x-4 lg:gap-x-6 desktop:gap-x-8 gap-y-7 lg:gap-y-9 desktop:gap-y-12">
            {userAddPlot.length > 0 ? (
              userAddPlot.map((property: any, index) => (
                <Link
                  key={index}
                  href={`/add-plot?plotId=${property?.id}`}
                  className="relative"
                >
                  <div className="flex flex-col gap-3 cursor-pointer relative z-40">
                    <div className="h-[300px] md:h-[350px] cursor-pointer">
                      {property?.map_image && (
                        <NorkartMap coordinates={property?.map_image} />
                      )}
                    </div>
                    <h4 className="text-black font-medium text-base lg:text-lg">
                      {property?.address}
                    </h4>
                  </div>
                  <div className="absolute z-50 top-0 left-0 h-full w-full"></div>
                </Link>
              ))
            ) : (
              <p>No Add plot found.</p>
            )}
          </div>
        )}
      </SideSpaceContainer>
    </div>
  );
};

export default index;
