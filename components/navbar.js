import React, {Component, useState} from 'react'; 
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from "../Firebase"

import styles from '../styles/navbar.module.css'

export default function navbar(){
    const user = auth.currentUser;

    return (
      <Navbar bg="dark" variant="dark" sticky="top" className={styles.container}>

        <Navbar.Brand>UCR Water</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link href="landing">Home</Nav.Link>
          <Nav.Link href="samz">SAMZ-Desert Tool</Nav.Link>
          <Nav.Link href="about">About</Nav.Link>
          { !user ? <Nav.Link href="googleSignInButton">Sign In</Nav.Link> : <Nav.Link href="signout">Sign Out</Nav.Link> }
        </Nav>
      
    </Navbar>
    )
}