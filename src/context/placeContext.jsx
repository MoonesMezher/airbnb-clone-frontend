import {createContext, useReducer} from "react";

export const placeContext = createContext();

const placeReducer = (state, action) => {
    switch(action.type) {
        case 'SET_PLACES': 
            localStorage.setItem('places', JSON.stringify(action.payload))
            return {
                places: action.payload
            }
        case 'CREATE_PLACE': 
            localStorage.setItem('places', JSON.stringify([...state.places,action.payload]))
            return {
                places: [...state.places,action.payload] 
            };
        case 'UPDATE_PLACE': 
            localStorage.setItem('places', JSON.stringify([...state.places,action.payload]))
            return {
                places: [...state.places,action.payload] 
            };
        case 'REMOVE_PLACE': 
            localStorage.setItem('places', JSON.stringify(state.places.filter(place => place != place._id)))
            return {
                places: state.places.filter(place => place != place._id)
            };
        default: 
            localStorage.setItem('places', JSON.stringify(state))
            return state
    }
}

export const PlaceContextProvider = ( { children } ) => {
    const [state, dispatch] = useReducer(placeReducer, {
        places: localStorage.getItem('places')? JSON.parse(localStorage.getItem('places')): [] 
    })

    return (
        <placeContext.Provider value={{...state, dispatch}}>
            { children }
        </placeContext.Provider>
    );
}