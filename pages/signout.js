import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
import { firebaseApp, provider, auth } from "../Firebase"
import { getAuth, signInWithPopup, signOut } from 'firebase/auth'
import useRouter from 'next/router'

function logout(){
    const SignOut = () => {
        signOut(auth)
        .then(() => {
            //console.log("signed out")
            localStorage.clear();
            window.location.href = "/landing";
        })
        .catch((error) => {
        });
    }
    return (
        <div className="googleButton">
            <button onClick={SignOut}> Sign Out </button>
        </div>
    )
}

export default logout;