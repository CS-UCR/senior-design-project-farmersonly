import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "../styles/navbar.module.css";

export default function navbar() {
  return (
    <Navbar variant="dark" sticky="top" className={styles.nav}>
      <Navbar.Brand>UCR Water</Navbar.Brand>

      <Nav className="me-auto">
        <Nav.Link href="landing">Home</Nav.Link>
        <Nav.Link href="samz">SAMZ-Desert Tool</Nav.Link>
        <Nav.Link href="about">About</Nav.Link>
      </Nav>

      <Nav className="justify-content-end">
        <Nav.Link href="signin">Sign In</Nav.Link>
      </Nav>
    </Navbar>
  );
}
