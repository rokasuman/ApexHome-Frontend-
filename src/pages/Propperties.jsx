import { useEffect, useRef, useState } from "react";
import { propertiesStyles as s } from "../assets/REAL-E-STATE/dummyStyles";
import { authUse } from "../../context/AuthContext";
import Navbar from "../components/Navbar";
import { HiFilter, HiSearch, HiX } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config";
const Properties = () => {
  const navigate = useNavigate();
  const { user, token } = authUse();
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [wishListId, setWishListId] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    city: "",
    propertyType: [],
    bhk: "",
    maxPrice: 100000000,
    amenities: [],
    furnishing: [],
    sort: "latest",
  });

  const propertyTypes = [
    { label: "Flat/Apartment", value: "flat" },
    { label: "Independent House/Villa", value: "villa" },
    { label: "Penthouse", value: "penthouse" },
    { label: "Commercial", value: "commercial" },
  ];
  const bhkOptions = ["1", "2", "3", "4", "5+"];
  const furnishingOptions = [
    { label: "Furnished", value: "furnished" },
    { label: "Semi-Furnished", value: "semi-furnished" },
    { label: "Unfurnished", value: "unfurnished" },
  ];

  //using the useEffect
  useEffect(() => {
    const qureyParams = new URLSearchParams(location.search);
    const city = qureyParams.get("city") || "";
    const type = qureyParams.get("type") || "";
    const bhk = qureyParams.get("bhk") || "";

    const initialFilter = {
      ...filters,
      city,
      propertyTypes: type ? [type] : [],
      bhk,
    };
    setFilters(initialFilter);
    fetchProperties(initialFilter);
    if (user) {
      fetchWishList();
    }
  }, [location.search, user]);

  //funtion fetch the wish
  const fetchWishList = async () => {
    try {
      //calling the api
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bear ${token}` },
      });
      setWishList(
        res.data
          .filter((item) => item.property)
          .map((item) => String(item.property._id)),
      );
    } catch (error) {
      console.log("Faild to fetch the wishList", error);
    }
  };

  //toggele the properties wishlist
  const toggleWishList = async (propertyId) => {
    try {
      const wishList = wishListId.includes(propertyId);
      if (wishList) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: { Authorization: `Bear ${token}` },
        });
        setWishListId((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/${propertyId}`,
          {},
          {
            headers: { Authorization: `Bear ${token}` },
          },
        );
        setWishListId((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.log("Fail to toggle the wishList", error);
    }
  };

  const fetchProperties = async (currentFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFilters.city) params.append("city", currentFilters.city);
      if (currentFilters.propertyType.length > 0)
        params.append("propertyType", currentFilters.propertyType.join(","));
      if (currentFilters.bhk) params.append("bhk", currentFilters.bhk);
      if (currentFilters.maxPrice)
        params.append("maxPrice", currentFilters.maxPrice);
      if (currentFilters.furnishing && currentFilters.furnishing.length > 0)
        params.append("furnishing", currentFilters.furnishing.join(","));
      if (currentFilters.sort) params.append("sort", currentFilters.sort);

      const res = await axios.get(
        `${API_URL}/api/property?${params.toString()}`,
      );
      setProperties(res.data.properties);
      setError(null);
    } catch (err) {
      setError("Failed to load properties. Please try again later.", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimer = useRef(null);

  const debouncedFetch = (updatedFilters) => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      fetchProperties(updatedFilters);
    }, 500);
  };

  const handleCheckboxChange = (category, value) => {
    const current = [...(filters[category] || [])];
    const index = current.indexOf(value);
    if (index === -1) {
      current.push(value);
    } else {
      current.splice(index, 1);
    }
    const updatedFilters = { ...filters, [category]: current };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const updatedFilters = { ...filters, maxPrice: value };
    setFilters(updatedFilters);
    debouncedFetch(updatedFilters);
  };

  const handleBhkSelect = (value) => {
    const updatedFilters = {
      ...filters,
      bhk: filters.bhk === value ? "" : value,
    };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const updatedFilters = { ...filters, sort: newSort };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const applyFilters = () => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchProperties(filters);
  };

  const resetFilters = () => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    const reset = {
      city: "",
      propertyType: [],
      bhk: "",
      maxPrice: 100000000,
      amenities: [],
      furnishing: [],
      sort: "latest",
    };
    setFilters(reset);
    navigate("/properties");
    fetchProperties(reset);
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className={s.pageContainer}>
      <Navbar />
      <div className={s.container}>
        <div className={s.mobileFilterButtonWrapper}>
          <button
            className={s.mobileFilterButton}
            onClick={() => setShowMobileFilter(true)}
          >
            <HiFilter /> Show filter & Search
          </button>
        </div>
        <div className={s.layout}>
          <aside
            className={`${s.sidebar} ${
              showMobileFilters ? s.sidebarVisible : s.sidebarHidden
            }`}
          >
            <div className={s.sidebarHeader}>
              <div className={s.sidebarTitleWrapper}>
                <HiFilter className={s.sidebarTitleIcon} />
                <h2 className={s.sidebarTitle}>Filters</h2>
              </div>

              <div className={s.sidebarHeaderActions}>
                <button onClick={resetFilters} className={s.resetButton}>
                  Reset
                </button>

                <button
                  className={s.closeMobileFilters}
                  onClick={() => setShowMobileFilters(false)}
                >
                  <HiX />
                </button>
              </div>
            </div>
            <div className={s.filtersScrollArea}>
              <div className={s.filterSection}>
                <label className={s.filterLabel}>Location</label>
                <div className={s.searchInputWrapper}>
                  <HiSearch className={s.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search by city..."
                    value={filters.city}
                    onChange={(e) => {
                      const updatedFilters = {
                        ...filters,
                        city: e.target.value,
                      };
                      setFilters(updatedFilters);
                      debouncedFetch(updatedFilters);
                    }}
                    className={s.searchInput}
                  />
                </div>
              </div>
              <div className={s.filterSection}>
                <div className={s.priceHeader}>
                  <label className={s.filterLabel}>Price Range</label>

                  <span className={s.priceValue}>
                    {new Intl.NumberFormat("en-AU", {
                      style: "currency",
                      currency: "AUD",
                      maximumFractionDigits: 0,
                    }).format(filters.maxPrice)}
                  </span>
                </div>

                <input
                  type="range"
                  min="500000"
                  max="20000000"
                  step="500000"
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                  className={s.priceSlider}
                />

                <div className={s.priceLabels}>
                  <span>$500k</span>
                  <span>$20M</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Properties;
