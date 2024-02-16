import { useContext } from "react";
import { bookingContext } from '../context/bookingContext'

export const useBookingContext = () => {
    const context = useContext(bookingContext);

    if(!context) {
        throw Error("useBookingContext does not work")
    }

    return context
}