import Head from 'next/head'
import Navbar from '../components/navbar'
import Landing from '../pages/landing'

import styles from '../styles/index.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>UCR Water</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <Navbar />
        <Landing />
      </>
      
    </div>
  )
}
