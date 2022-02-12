import React, { useEffect, useState } from 'react';
//import { signInWithGoogle, SignOut } from "../Firebase"
import { provider, auth, db } from "../Firebase"
import { signInWithPopup } from 'firebase/auth'
import { setDoc } from 'firebase/firestore'
import useRouter from 'next/router'

var uid = "";

function googleSignIn(/* { setIsAuth } */){
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result)=>{
            localStorage.setItem("isAuth", true);
            console.log(result);
            //console.log("in")
            window.location.href = "/landing";
            const user = auth.currentUser;
            uid = user.uid;
            // const colRef = collection(db, 'userFields');
            // addDoc(colRef, {
            //     excel: "Test Upload"
            // });
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

export const currentUID = uid;

export default googleSignIn;