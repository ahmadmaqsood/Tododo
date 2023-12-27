import React, { createContext, useEffect, useReducer } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Config/firebase';

export const AuthContext = createContext()

const initialState = { isAuthenticated: false }

const reducer = ((state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { isAuthenticated: true, user: action.payload?.user }
        case "LOGOUT":
            return { isAuthenticated: false }
        default:
            return state
    }
})

export default function AuthContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in")
                dispatch({ type: "LOGIN", payload: { user } })
            } else {
                dispatch({ type: "LOGOUT" })
                console.log('User is signed out');
            }
        });
    }, [])
    return (
        <AuthContext.Provider value={{...state, dispatch }}>
            {props.children}
        </AuthContext.Provider>
    )

}
