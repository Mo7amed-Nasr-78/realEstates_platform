import { useContext, createContext } from "react";

export const PropsContext = createContext(null);

export const useProps = () => useContext(PropsContext);