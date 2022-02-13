import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBYwE7zeVbWElrkzByoplpr1Tjy-UX3irg",
  authDomain: "auth-dev-5c3a5.firebaseapp.com",
  projectId: "auth-dev-5c3a5",
  storageBucket: "auth-dev-5c3a5.appspot.com",
  messagingSenderId: "464851300677",
  appId: "1:464851300677:web:f5bf7abfdd6146dfd5ce2c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore();
 
//export default app;  // added // 

/*export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((re)=>{
        console.log(re);
    })
    .catch((error) => {
        console.log(error);
    });
}

export function SignOut() {
    signOut(auth)
    .then(() => {
    })
    .catch((error) => {
    });
}*/