import { useContext } from "react"
import { userContext } from "../context/userContext"

export const useUserContext = () => {
    const context = useContext(userContext);
    if(!context) {
        throw Error("useUserContext does not work");
    }

    return context
}