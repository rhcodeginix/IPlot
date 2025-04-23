import React, { createContext, useContext, useEffect, useState } from "react";

type ProductType = any;

interface CustomizeHouseContextType {
  customizeHouse: ProductType[] | null;
  updateCustomizeHouse: (data: ProductType[] | null) => void;
}

const CustomizeHouseContext = createContext<
  CustomizeHouseContextType | undefined
>(undefined);

export const CustomizeHouseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [customizeHouse, setCustomizeHouse] = useState<ProductType[] | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("customizeHouse");
    if (stored) {
      setCustomizeHouse(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = localStorage.getItem("customizeHouse");
      setCustomizeHouse(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("customizeHouseUpdated", handleUpdate);

    window.addEventListener("storage", (e) => {
      if (e.key === "customizeHouse") handleUpdate();
    });

    return () => {
      window.removeEventListener("customizeHouseUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateCustomizeHouse = (data: ProductType[] | null) => {
    if (data === null) {
      localStorage.removeItem("customizeHouse");
      setCustomizeHouse(null);
    } else {
      localStorage.setItem("customizeHouse", JSON.stringify(data));
      setCustomizeHouse(data);
    }

    window.dispatchEvent(new Event("customizeHouseUpdated"));
  };

  return (
    <CustomizeHouseContext.Provider
      value={{ customizeHouse, updateCustomizeHouse }}
    >
      {children}
    </CustomizeHouseContext.Provider>
  );
};

export const useCustomizeHouse = () => {
  const context = useContext(CustomizeHouseContext);
  if (!context) {
    throw new Error(
      "useCustomizeHouse must be used within CustomizeHouseProvider"
    );
  }
  return context;
};
