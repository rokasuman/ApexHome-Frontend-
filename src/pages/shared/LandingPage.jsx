import { useEffect, useState } from "react";
import { landingPageStyles as s } from "../../assets/REAL-E-STATE/dummyStyles";
import Navbar from "../../components/Navbar.jsx";
import banner from "../../assets/REAL-E-STATE/bannerimage.png";
import {
  HiCurrencyDollar,
  HiHome,
  HiLightningBolt,
  HiLocationMarker,
  HiOfficeBuilding,
  HiSearch,
  HiShieldCheck,
  HiVideoCamera,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { authUse } from "../../../context/AuthContext.jsx";
import axios from "axios";
import API_URL from "../../../config.js";

const LandingPage = () => {
  const [properties, setProperties] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyType, setPropertyType] = useState("Select Type");
  const [propertyCounts, setPropertyCounts] = useState({
    flat: 0,
    villa: 0,
    penthouse: 0,
    commercial: 0,
  });
  const navigate = useNavigate();
  const { user, token } = authUse();

  //to fetech the wish list
  const fetchWishList = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishList(
        res.data
          .filter((item) => item.property)
          .map((item) => String(item.property._id)),
      );
    } catch (error) {
      console.log("fail to fetch the wishlist", error);
    }
  };
  //remove the wishlist
  const handleToggleWishList = async (propertyId) => {
    try {
      const isWishListed = wishList.includes(propertyId);
      if (isWishListed) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishList((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/${propertyId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        //add the wishlist
        setWishList((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.log("Fail to toggle the wishList:", error);
    }
  };
  const fetchCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/property/count`);
      if (res.data.success) {
        setPropertyCounts(res.data.counts);
      }
    } catch (error) {
      console.log("Faild to fetch the properties", error);
    }
  };

  //fetch the properties
  const fetchProperties = async (search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/property?city=${search}`);
      setProperties(res.data.properties || res.data || []);
      setError(null);
    } catch (error) {
      console.log("Failed to fetch the properties", error);
    } finally {
      setLoading(false);
    }
  };
  //for search
  const handleSearch = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm) params.append("city", searchTerm);
    if (propertyType !== "Select Type") params.append("type", propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    {
      name: "Modern Flats",
      count: propertyCounts.flat || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "flat",
    },
    {
      name: "Luxury Villas",
      count: propertyCounts.villa || 0,
      icon: <HiHome size={32} />,
      type: "villa",
    },
    {
      name: "Penthouse",
      count: propertyCounts.penthouse || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "penthouse",
    },
    {
      name: "Commercial",
      count: propertyCounts.commercial || 0,
      icon: <HiOfficeBuilding size={32} />,
      type: "commercial",
    },
  ];

  const features = [
    {
      title: "Verified Trust",
      desc: "Every listing is strictly audited for ownership, condition, and legality.",
      icon: <HiShieldCheck size={24} />,
    },
    {
      title: "Smart Search",
      desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
      icon: <HiLightningBolt size={24} />,
    },
    {
      title: "Best Value",
      desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
      icon: <HiCurrencyDollar size={24} />,
    },
    {
      title: "Virtual Tours",
      desc: "High-definition 3D tours allow you to experience the property from home.",
      icon: <HiVideoCamera size={24} />,
    },
  ];

  useEffect(() => {
    fetchProperties();
    fetchCount();
    if (user) {
      fetchWishList();
    }
  }, [user]);

  return (
    <div className={s.bgMain}>
      <Navbar />
      {/*here section*/}
      <section className={s.heroSection}>
        <div className={s.heroContent}>
          <span className={s.badge}>Trusted by 5000+ homeowners</span>
          <h1 className={s.heroTitle}>
            Find Your <span className={s.textGradient}>Perfect</span> Next
            Chapter
          </h1>
          <p className={s.heroSubtitle}>
            Experience the most advanced real estate search platform. Discover
            verified listigs, connect with top agents and find a place you love.
          </p>

          <form onSubmit={handleSearch} className={s.searchForm}>
            <div className={s.searchField}>
              <div className={s.textPrimary}>
                <HiLocationMarker size={26} />
              </div>
              <div className={s.flexCol}>
                <label className={s.labelSmall}>Location</label>
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={s.inputTransparent}
                />
              </div>
            </div>
            <div className={s.searchDivider}></div>
            <div className={s.searchField}>
              <div className={s.textPrimary}>
                <HiHome size={26} />
              </div>
              <div className={s.flexCol}>
                <label className={s.labelSmall}>Properties Types</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={`${s.inputTransparent} cursor-pointer`}
                >
                  <option value="Select Type">Select Type</option>
                  <option value="flat">Flat/Apartment</option>
                  <option value="villa">Villa/House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <button className={s.searchButton} type="submit">
              <HiSearch size={26} />
            </button>
          </form>
          <div className={s.statsContainer}>
            <div className={s.statItemFlex}>
              <h3 className={s.statNumber}>5K+</h3>
              <p className={s.statLabel}>Properties Ready</p>
            </div>
            <div className={s.statItemBorder}>
              <h3 className={s.statNumber}>100+</h3>
              <p className={s.statLabel}>Agent Network</p>
            </div>
            <div className={s.statItemBorder}>
              <h3 className={s.statNumber}>4.8/5</h3>
              <p className={s.statLabel}>User Rating</p>
            </div>
          </div>
        </div>
        <div className={s.heroImageContainer}>
          <div className={s.imageWrapper}>
            <img className={s.heroImage} src={banner} alt="banner" />

            <div className={s.verifiedBadge}>
              <div className={s.badgeIconWrapper}>
                <HiShieldCheck size={24} className=" text-primary" />
              </div>
              <div>
                <h4 className={s.badgeTitle}></h4>
                <p className={s.badgeText}>
                  Inspected by our professional team
                </p>
              </div>
              <span className={s.preApproved}>Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* categoray section */}
      <section className={s.categorySection}>
        <div className={s.container}>
          <div className={s.categoryHeader}>
            <div className={s.categoryHeader}></div>
            <div className={s.categoryHeaderText}>
              <h2 className={s.sectionTitle}>Browse by Category</h2>
              <p className={s.sectionSubtitle}>
                Find your perfect property based on your lifestyle.
              </p>
            </div>
          </div>
        </div>
        <div className={s.categoryGrid}>
          {categories.map((category) => (
            <div
              key={category.type}
              className={s.categoryCard}
              onClick={() => navigate(`/properties?type=${category.type}`)}
            >
              <div className={s.categoryIconWrapper}>{category.icon}</div>

              <h3 className={s.categoryTitle}>{category.name}</h3>

              <p className={s.categoryCount}>{category.count} Properties</p>
            </div>
          ))}
        </div>
      </section>

      {/*feature section */}
      <section className={s.featuresSection}>
        <div className={s.featuresContainer}>
          <div className={s.featuresList}>
            {features.map((f, index) => (
              <div
                key={index}
                className={s.featureCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={s.featureIconWrapper}>{f.icon}</div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className={s.featuresContent}>
            <h2 className={s.featuresHeading}>
              Why Apex Home
              <br /> is the{" "}
              <span className={s.textGradient}>Prefered Choice.</span>
            </h2>
            <p className={s.featuresSubtext}>
              Apex Home Improvement is a home renovation and improvement company
              specializing in high-quality residential construction and
              remodeling services. With decades of industry experience, Apex
              Home Improvement focuses on delivering reliable workmanship,
              quality materials, and customer satisfaction while completing
              projects on time and within budget.
            </p>
            <ul className={s.featuresListItems}>
              {[
                "Direct connection with certified agent",
                "Real-time market valuation",
                "Secure doucment management systems",
              ].map((val, idx) => (
                <li key={idx} className={s.listItem}>
                  <HiLightningBolt className="text-primary" /> {val}
                </li>
              ))}
            </ul>
            <a className={s.learnMoreLink} href="#process">
              Learn more about our process &rarr;
            </a>
          </div>
        </div>
      </section>
      {/*learn more or how it works*/}
      <section id="process" className={s.processSection}>
        <div className={s.container}>
          <div className={s.processHeader}>
            <span className={s.processBadge}>How it Works</span>
            <h2 className={s.processTitle}>
              Our Seamless <span className={s.textGradient}>Process</span>
            </h2>
            <p className={s.processSubtitle}>
              We have simplified the journay of finding your dream Home in Three
              steps{" "}
            </p>
          </div>
          <div className={s.processGrid}>
            {[
              {
                step: "01",
                title: "Smart Search",
                desc: "Leverage our AI-driven Smart Search algorithms to find the best property matches tailored to your specific preferences.",
                icon: <HiLightningBolt size={32} />,
              },
              {
                step: "02",
                title: "Virtual Tours",
                desc: "Experience your future home from anywhere with our high-definition 3D virtual tours and immersive walkthroughs.",
                icon: <HiVideoCamera size={32} />,
              },
              {
                step: "03",
                title: "Verified Trust",
                desc: "Every listing is strictly audited for ownership and condition, ensuring your peace of mind and a secure transaction.",
                icon: <HiShieldCheck size={32} />,
              },
            ].map((p, idx) => (
              <div className={s.processCard} key={idx}>
                <div className={s.stepNumber}>{p.step}</div>
                <div className={s.processIconWrapper}>{p.icon}</div>
                <div className={s.processCardTitle}>{p.title}</div>
                <div className={s.processCardDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/*feature section */}
      <section>
        
      </section>
    </div>
  );
};

export default LandingPage;
