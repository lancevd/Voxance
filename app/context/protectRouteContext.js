import { useContext, createContext, use } from "react";
import { useAuth } from "./authContext";

const ProtectRouteContext = createContext();

export const ProtectRouteProvider = ({ children }) => {

    const {user} = useAuth()

    const protectRoute = () => {
        user ? null : router.push("/login")
    }

    return (
        <ProtectRouteContext.Provider value={{protectRoute}}>
            {children}
        </ProtectRouteContext.Provider>
    )
}