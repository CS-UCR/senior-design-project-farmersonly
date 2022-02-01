import React, {Component, useState} from 'react'; 
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { auth } from "../Firebase"
//import { onAuthStateChanged } from '../Firebase'

import styles from "../styles/navbar.module.css";

export default function navbar(){
    //const user = auth.currentUser;

    // onAuthStateChanged(auth, user => {
    //   if (user) {
    //     // User is signed in.
    //     console.log("signed in");
    //     console.log(user.displayName);
    //   } 
    //   else {
    //     // No user is signed in.
    //     console.log("signed out");
    //   }
    // });

  return (
    <Navbar variant="dark" className={styles.nav}>
      <Navbar.Brand>UCR Water</Navbar.Brand>

      <Nav className="me-auto">
        <Nav.Link href="landing">Home</Nav.Link>
        <Nav.Link href="samz">SAMZ-Desert Tool</Nav.Link>
        <Nav.Link href="about">About</Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
          <Nav.Link href="googleSignInButton">Sign In</Nav.Link>
          <Nav.Link href="signout">Sign Out</Nav.Link>
      </Nav>
    </Navbar>
  );
}
