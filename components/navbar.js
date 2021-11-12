import React, {Component} from 'react'; 
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from '../styles/navbar.module.css'


export default function navbar(){
    return (
      <Navbar bg="dark" variant="dark"  className={styles.container}>

        <Navbar.Brand href="#home">UCR Water</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link href="#landing">Home</Nav.Link>
          <Nav.Link href="samz">SAMZ-Desert Tool</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
          <Nav.Link href="about">About</Nav.Link>
        </Nav>
      
    </Navbar>
    )
}