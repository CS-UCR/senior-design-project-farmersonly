import React from 'react';
import { firebaseApp, auth, provider } from "../Firebase"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

//const auth = getAuth();

export default function SignIn(){
    const signInWithGoogle = () =>{
        signInWithPopup(auth, provider)
        .then((result) =>{
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;

            console.log(user.uid);

        })
        .catch((error) =>{
            console.log(error);
        });
        
    }

    // onAuthStateChanged(auth, (user) =>{ 
    //     if(user){

    //         const uid = user.uid; // User ID we will use to be accessing user's files

    //     }
    //     else{

    //         //sign out user somehow

    //     }
    // });
    
    return(
        <div className="googleButton">
            <button onClick={signInWithGoogle}> Sign In With Google </button>
        </div>
    )
}

//import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
//import { provider, auth } from "../Firebase"
//import { signInWithPopup } from 'firebase/auth'
//import useRouter from 'next/router'

//function googleSignIn(/* { setIsAuth } */){
/*    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result)=>{
            console.log(auth.currentUser)
            localStorage.setItem("isAuth", true);
            console.log(result);
            console.log("in")
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

export default googleSignIn;*/