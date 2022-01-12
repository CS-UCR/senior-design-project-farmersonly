//import { initializeApp, getApp } from "firebase/app"
//import * as firebase from "firebase/app"
//import firebase from 'firebase/app'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//import { getAuth } from "firebase/auth"

//const app = firebase.initializeApp({
const config = {
    /*apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID*/
    apiKey: "AIzaSyBYwE7zeVbWElrkzByoplpr1Tjy-UX3irg",
    authDomain: "auth-dev-5c3a5.firebaseapp.com",
    projectId: "auth-dev-5c3a5",
    storageBucket: "auth-dev-5c3a5.appspot.com",
    messagingSenderId: "464851300677",
    appId: "1:464851300677:web:f5bf7abfdd6146dfd5ce2c"

}//)

if (firebase.apps.length === 0) {
    this.app = firebase.initializeApp(config);
  }

//export const auth = app.auth()
export const auth = getAuth(app)
export default app
