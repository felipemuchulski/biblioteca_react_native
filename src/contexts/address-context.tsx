import { createContext, useContext, useState, type ReactNode } from "react";

import type { Coordinates } from "@/types";

interface AddressContextData {
  selectedLocation: Coordinates | null;
  setSelectedLocation: (location: Coordinates | null) => void;
}

export const AddressContext = createContext<AddressContextData | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null,
  );

  return (
    <AddressContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error("useAddress deve ser usado dentro de AddressProvider");
  }

  return context;
}
