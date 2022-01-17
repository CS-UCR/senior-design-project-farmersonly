import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
import { provider, auth } from "../Firebase"
import { signInWithPopup } from 'firebase/auth'
import useRouter from 'next/router'

function redirect({to}) {
    let router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [to]);

    return null;
}

function googleSignIn(/* { setIsAuth } */){
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result)=>{
            localStorage.setItem("isAuth", true);
            console.log(result);
            console.log("in")
            redirect("/about");
            window.location.pathname = "/about";
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


function logout(){
    return (
        <div className="googleButton">
            <button onClick={SignOut}> Sign Out </button>
        </div>
    )
}

export default googleSignIn;