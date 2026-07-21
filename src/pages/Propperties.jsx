import React from 'react'
import { propertiesStyles as s  } from '../assets/REAL-E-STATE/dummyStyles'
import { authUse } from '../../context/AuthContext'
import Navbar from '../components/Navbar'
import { HiFilter } from 'react-icons/hi'
const Properties = () => {
  return (
    <div className={s.pageContainer}>
      <Navbar/>
        <div className={s.container}>
          <div className={s.mobileFilterButtonWrapper}>
            <button className={s.mobileFilterButton} onClick={()=>setShowMobileFilter(true)}>
               <HiFilter/> Show filter & Search
            </button>

          </div>

        </div>
    </div>
  )
}

export default Properties