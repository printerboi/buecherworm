import { useContext } from "react";
import AuthContext from "./AuthedContext";

const useAuth = () => {
    const data = useContext(AuthContext);
    return data;
}

export default useAuth;