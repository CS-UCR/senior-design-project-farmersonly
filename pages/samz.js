import React from 'react'
import Donut from '../components/donutChart'
import PerformanceChart from '../components/performance'

import styles from '../styles/samz.module.css'

export default function samz(){
  return(
    <div >
      {/* <form>
        <label>
          File:
          <input type="file" name="name" />
        </label>
      </form> */}

      <Donut/>
      <PerformanceChart/>
    </div>
    
  )
}