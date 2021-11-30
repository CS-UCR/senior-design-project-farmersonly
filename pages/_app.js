import '../styles/globals.css'
import Navbar from '../components/navbar'
import React from 'react'
import Footer from '../components/footer'

function App({ Component, pageProps }){
  return(
    <React.Fragment>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </React.Fragment>
  )
} 

export default App