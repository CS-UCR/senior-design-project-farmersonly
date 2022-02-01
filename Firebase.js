import { initializeApp, getAuth } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYwE7zeVbWElrkzByoplpr1Tjy-UX3irg",
  authDomain: "auth-dev-5c3a5.firebaseapp.com",
  projectId: "auth-dev-5c3a5",
  storageBucket: "auth-dev-5c3a5.appspot.com",
  messagingSenderId: "464851300677",
  appId: "1:464851300677:web:f5bf7abfdd6146dfd5ce2c"
};
 
const app = initializeApp(firebaseConfig);

//Exporting the necessary credentials(?) for authenticating through google
export const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

//For getting a reference to the storage service (Firestore)
const storage = getStorage(app);


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