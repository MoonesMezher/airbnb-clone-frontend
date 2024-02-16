import {createContext, useReducer} from "react";

export const userContext = createContext();

const userReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN": 
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                user: action.payload
            };
        case "LOGOUT":
            localStorage.removeItem('user');
            localStorage.removeItem('place');
            return {
                user: null
            };
        case "UPDATE_USER": 
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                user: action.payload
            };
        default:
            localStorage.removeItem('user');
            return {
                user: null
            };
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')): null
    })

    return (
        <userContext.Provider value={{...state, dispatch}}>
            { children }
        </userContext.Provider>
    );
}