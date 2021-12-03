import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Landing from '../pages/landing'
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>UCR IWO Tool</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <Landing />
      </>
      

      
    </div>
  )
}