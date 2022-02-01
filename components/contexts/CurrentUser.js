import React, { useContext, useState }from 'react'
import { auth } from '../../Firebase'

const AuthContext = React.createContext();

export function getUser() {
    return useContext(AuthContext)
}

export function currIDProvider({ children }){

    const [currentUser, setCurrentUser] = useState()

    

    const value = {
        currentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}