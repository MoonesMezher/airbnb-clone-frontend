import { useContext } from "react";
import { placeContext } from '../context/placeContext'

export const usePlaceContext = () => {
    const context = useContext(placeContext);

    if(!context) {
        throw Error("usePlaceContext does not work")
    }

    return context
}