import React from 'react'

import styles from '../styles/samz.module.css'

export default function samz(){
  return(
    <div className={styles.container}>
      <form>
        <label>
          File:
          <input type="file" name="name" />
        </label>
      </form>
    </div>
    
  )
}