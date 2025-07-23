import { useState, useCallback } from "react";
import { NavbarContext } from "./NavbarContext";

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [height, setHeight] = useState(0);
  const updateHeight = useCallback((newHeight: number) => {
    setHeight(newHeight);
  }, []);

  return (
    <NavbarContext.Provider value={{ height, setHeight: updateHeight }}>
      {children}
    </NavbarContext.Provider>
  );
};
