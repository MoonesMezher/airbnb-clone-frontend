import {createContext, useReducer} from "react";

export const bookingContext = createContext();

const bookingReducer = (state, action) => {
    switch(action.type) {
        case 'SET_BOOKINGS': 
            return {
                bookings: action.payload
            }
        case 'CREATE_BOOKING': 
            return {
                bookings: [...state.bookings,action.payload] 
            };
        case 'UPDATE_BOOKING': 
            return {
                bookings: [...state.bookings,action.payload] 
            };
        case 'REMOVE_BOOKING': 
            return {
                bookings: state.bookings.filter(booking => booking != booking._id)
            };
        default: 
            return state
    }
}

export const BookingContextProvider = ( { children } ) => {
    const [state, dispatch] = useReducer(bookingReducer, {
        bookings: localStorage.getItem('booking')? JSON.parse(localStorage.getItem('booking')): [] 
    })

    return (
        <bookingContext.Provider value={{...state, dispatch}}>
            { children }
        </bookingContext.Provider>
    );
}