import { useContext } from "react"
import { themeMoodContext } from "../context/themeMoodContext"

export const useThemeMoodContext = () => {
    const context = useContext(themeMoodContext);
    if(!context) {
        throw Error("useThemeMoodContext does not work");
    }

    return context
}