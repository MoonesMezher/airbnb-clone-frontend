import { createContext, useReducer } from "react";

export const themeMoodContext = createContext();

const themeMoodReducer = (state, action) => {
    switch(action.type) {
        case 'SUN':
            localStorage.setItem('mood', 'SUN')
            return {
                mood: 'SUN'
            }
        case 'MOON': 
            localStorage.setItem('mood', 'MOON')
            return {
                mood: 'MOON'
            }
        default: 
            localStorage.setItem('mood', 'SUN')
            return {
                mood: 'SUN'
            }
    }
}

export const ThemeMoodProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeMoodReducer, {
        mood: localStorage.getItem('mood')? localStorage.getItem('mood'): 'SUN'
    })

    return (
        <themeMoodContext.Provider value={{...state, dispatch}}>
            {children}
        </themeMoodContext.Provider>
    )
}
