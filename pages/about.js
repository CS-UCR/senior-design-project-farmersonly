
import React from 'react'
import styles from '../styles/about.module.css'
import Navbar from '../components/navbar'
import Head from 'next/head'

export default function test(){
    return(
        
        <div className = {styles.container}>
            <Head>
            <title>UCR Water</title>
            <link rel="icon" href="/favicon.ico" />
            <Navbar />
            <h1 className = {styles.title}>About Us</h1>

        </Head>

        </div>
    )
}