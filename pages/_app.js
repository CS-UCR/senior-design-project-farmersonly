import '../styles/globals.css'
import Navbar from '../components/navbar'
import React from 'react'
<<<<<<< HEAD

=======
import Footer from '../components/footer'

import Button from '@mui/material/Button';
>>>>>>> main
function App({ Component, pageProps }){
  return(
    <React.Fragment>
      <Navbar />
      <Component {...pageProps} />
<<<<<<< HEAD
    </React.Fragment>
  )
}
=======
      <Footer />
    </React.Fragment>
  )
} 
>>>>>>> main

export default App