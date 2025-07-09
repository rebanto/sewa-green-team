import { createContext, useContext } from "react";

export type NavbarContextType = {
	height: number;
	setHeight: (height: number) => void;
};

export const NavbarContext = createContext<NavbarContextType | undefined>(
	undefined
);

export const useNavbar = (): NavbarContextType => {
	const context = useContext(NavbarContext);
	if (!context) {
		throw new Error("useNavbar must be used within a NavbarProvider");
	}
	return context;
};
