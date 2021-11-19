import '../styles/globals.css'
import Navbar from '../components/navbar'
import React from 'react'
import Button from '@mui/material/Button';
function App({ Component, pageProps }){
  return(
    <React.Fragment>
      <Navbar />
      <Component {...pageProps} />
    </React.Fragment>
  )
}

export default App