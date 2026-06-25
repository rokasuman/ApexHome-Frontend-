import  { useEffect, useState } from 'react'
import { landingPageStyles as s } from '../../assets/REAL-E-STATE/dummyStyles'
import Navbar from '../../components/Navbar.jsx'
import { HiLocationMarker } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { authUse } from '../../../context/AuthContext.jsx'
import axios from 'axios'
import API_URL from '../../../config.js'

const LandingPage = () => {

  const [wishList, setWishList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const [propertyType,setPropertyType] = useState("select Type")
  const [propertyCount, setPropertyCount] = useState({
    flat : 0,
    villa : 0,
    penthouse :0,
    commerical: 0,
  })
   const navigate = useNavigate()
    const {user,token} = authUse()
 
  const handleSearch = (e) => {
    e.preventDefault()
   
  
  }
  //to fetech the wish list 
const fetchWishList = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishList(
      res.data
        .filter((item) => item.property)
        .map((item) => String(item.property._id))
    );
  } catch (error) {
    console.log("fail to fetch the wishlist", error);
  }
};
//remove the wishlist 
const handleToggleWishList = async(propertyId) =>{
  try {
    const isWishListed = wishList.includes(propertyId);
    if(isWishListed){
    await axios.delete(`${API_URL}/api/wishlist/${propertyId}`,{
      headers:  { Authorization: `Bearer ${token}` },
    });
       setWishList((prev) =>
      prev.filter((id) => id !== propertyId)
    );
  }else{
    await axios.post(`${API_URL}/api/wishlist/${propertyId}`,{}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWishList((prev)=>[...prev, propertyId])
  }
  } catch (error) {
    console.log("Fail to toggle the wishList:",error)
  }
}

  useEffect(()=>{
      fetchProperties();
      fetchCount();
      if(user){
        fetchWishList()
      }
    },[user])

  return (
    <div className={s.bgMain}>
        <Navbar/>
        {/*here section*/}
        <section className={s.heroSection}>
          <div className={s.heroContent}>
            <span className={s.badge}>Trusted by 5000+ homeowners</span>
            <h1 className={s.heroTitle}>
              Find Your <span className={s.textGradient}>Perfect</span> Next Chapter
            </h1>
            <p className={s.heroSubtitle}>
              Experience the most advanced real estate search platform. Discover verified listigs, connect with top agents and find a place you love.
            </p>

            <form onSubmit={handleSearch} className={s.searchForm}>
              <div className={s.searchField}>
                <div className={s.textPrimary}>
                  <HiLocationMarker size={26} />
                </div>
                <div className={s.flexCol}>
                  <label className={s.labelSmall}>Location</label>
                  <input 
                  type='text'
                  placeholder='Where are you looking?'
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                  className={s.inputTransparent}
                  />

                </div>

              </div>

              
            </form>


          </div>

        </section>
          

        
    </div>
  )
}

export default LandingPage