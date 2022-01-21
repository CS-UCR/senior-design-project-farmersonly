import React, { useEffect } from 'react';
import { signInWithGoogle } from "../Firebase"

function googleSignIn(){
    var name = "name"
    var email = "email"
    useEffect(() => {
        const name = localStorage.getItem("name")
        const email = localStorage.getItem("email")
      }, [])
      
    return (
        <div className="googleButton">
            <button onClick={signInWithGoogle}> Sign In With Google </button>
            <button onClick={location.href='myDocs'} ></button>
            console.log('Signed in');
            <h1>{name}</h1>
            <h1>{email}</h1>
        </div>
    )
}

export default googleSignIn;