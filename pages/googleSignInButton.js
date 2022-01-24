import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
import { provider, auth } from "../Firebase"
import { signInWithPopup } from 'firebase/auth'
import useRouter from 'next/router'

function googleSignIn(/* { setIsAuth } */){
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result)=>{
            localStorage.setItem("isAuth", true);
            console.log(result);
            //console.log("in")
            window.location.href = "/landing";
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return (
        <div className="googleButton">
            <button onClick={signInWithGoogle}> Sign In With Google </button>
        </div>
    )
}

export default googleSignIn;