import React from 'react'
import { logoStyles  as s } from '../assets/REAL-E-STATE/dummyStyles'
import { Link } from 'react-router'
import { FaHome } from "react-icons/fa";

const Logo = ({
    fontSize = "1.5 rem",
    iconSize = 24,
    showText = true,
    ...props

}) => {

  return (
    <Link 
    to="/"
    {...props}
    className={`${s.link} ${props.className || ""}`}
    style={{fontSize, ...props.style}}
    >
        <div className={s.iconWrapper}>
            <FaHome size={iconSize}/>
        </div>
        {showText && <span className={s.text}>Apex-Home</span>}
    </Link>
  )
}

export default Logo