import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
import { provider, auth } from "../Firebase"
import { signInWithPopup, signOut } from 'firebase/auth'
import useRouter from 'next/router'

function redirect({to}) {
    let router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [to]);

    return null;
}

function logout(){
    const SignOut = () => {
        signOut(auth)
        .then(() => {
            console.log("signed out")
            localStorage.clear();
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