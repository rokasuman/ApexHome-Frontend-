import React, { useState } from 'react'
import { propertiesStyles as s  } from '../assets/REAL-E-STATE/dummyStyles'
import { authUse } from '../../context/AuthContext'
import Navbar from '../components/Navbar'
import { HiFilter } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'
const Properties = () => {

  const navigate = useNavigate();
  const {user, token} = authUse();
  const location = useLocation()
  const [properties, setProperties] = useState([]);
  const [wishList, setWishList] = useState([])
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([])


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