
import React from 'react'
import styles from '../styles/about.module.css'
import Navbar from '../components/navbar'
import Head from 'next/head'

export default function about(){
    return(
       <div className={styles.container}>
        <h1 className={styles.title}>About Us</h1>
        <h2 className={styles.body}>We are UCR Water, a team
        partnered with Dr.Akansha from the Hanghverdi Water Management Group.</h2>
        <h2 className={styles.body}>Our goal is to provide web-based tools 
        for farmers to better manage their water usage and improve their productivity
        to tackle California's water scarcity problems.</h2>
       </div>
    )
}