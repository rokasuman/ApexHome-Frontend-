import { useEffect, useRef, useState } from "react";
import { propertiesStyles as s } from "../assets/REAL-E-STATE/dummyStyles";
import { authUse } from "../../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  HiAdjustments,
  HiFilter,
  HiSearch,
  HiViewGrid,
  HiViewList,
  HiX,
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = authUse();

  const [properties, setProperties] = useState([]);
  const [wishListId, setWishListId] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: "",
    propertyType: [],
    bhk: "",
    maxPrice: 20000000,
    amenities: [],
    furnishing: [],
    sort: "latest",
  });

  const [viewMode, setViewMode] = useState("grid");

  const propertyTypes = [
    {
      label: "Flat/Apartment",
      value: "flat",
    },
    {
      label: "Independent House/Villa",
      value: "villa",
    },
    {
      label: "Penthouse",
      value: "penthouse",
    },
    {
      label: "Commercial",
      value: "commercial",
    },
  ];

  const bhkOptions = ["1", "2", "3", "4", "5+"];

  const furnishingOptions = [
    {
      label: "Furnished",
      value: "furnished",
    },
    {
      label: "Semi-Furnished",
      value: "semi-furnished",
    },
    {
      label: "Unfurnished",
      value: "unfurnished",
    },
  ];

  // Fetch properties and wishlist when URL or user changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const city = queryParams.get("city") || "";
    const type = queryParams.get("type") || "";
    const bhk = queryParams.get("bhk") || "";

    const initialFilter = {
      ...filters,
      city,
      propertyType: type ? [type] : [],
      bhk,
    };

    setFilters(initialFilter);

    fetchProperties(initialFilter);

    if (user && token) {
      fetchWishList();
    } else {
      setWishListId([]);
    }
  }, [location.search, user, token]);

  // Fetch wishlist
  const fetchWishList = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishListId(
        res.data
          .filter((item) => item.property)
          .map((item) => String(item.property._id)),
      );
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  // Toggle wishlist
  const toggleWishList = async (propertyId) => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    try {
      const isWishlisted = wishListId.includes(String(propertyId));

      if (isWishlisted) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishListId((prev) => prev.filter((id) => id !== String(propertyId)));
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/${propertyId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setWishListId((prev) => [...prev, String(propertyId)]);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  // Fetch properties
  const fetchProperties = async (currentFilters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (currentFilters.city) {
        params.append("city", currentFilters.city);
      }

      if (currentFilters.propertyType?.length > 0) {
        params.append("propertyType", currentFilters.propertyType.join(","));
      }

      if (currentFilters.bhk) {
        params.append("bhk", currentFilters.bhk);
      }

      if (currentFilters.maxPrice) {
        params.append("maxPrice", currentFilters.maxPrice);
      }

      if (currentFilters.furnishing?.length > 0) {
        params.append("furnishing", currentFilters.furnishing.join(","));
      }

      if (currentFilters.sort) {
        params.append("sort", currentFilters.sort);
      }

      const res = await axios.get(
        `${API_URL}/api/property?${params.toString()}`,
      );

      setProperties(res.data.properties || []);

      setError(null);
    } catch (err) {
      console.error("Failed to load properties:", err);

      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce timer
  const fetchTimer = useRef(null);

  const debouncedFetch = (updatedFilters) => {
    if (fetchTimer.current) {
      clearTimeout(fetchTimer.current);
    }

    fetchTimer.current = setTimeout(() => {
      fetchProperties(updatedFilters);
    }, 500);
  };

  // Checkbox change
  const handleCheckboxChange = (category, value) => {
    const current = [...(filters[category] || [])];

    const index = current.indexOf(value);

    if (index === -1) {
      current.push(value);
    } else {
      current.splice(index, 1);
    }

    const updatedFilters = {
      ...filters,
      [category]: current,
    };

    setFilters(updatedFilters);

    debouncedFetch(updatedFilters);
  };

  // Price change
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value, 10);

    const updatedFilters = {
      ...filters,
      maxPrice: value,
    };

    setFilters(updatedFilters);

    debouncedFetch(updatedFilters);
  };

  // BHK selection
  const handleBhkSelect = (value) => {
    const updatedFilters = {
      ...filters,
      bhk: filters.bhk === value ? "" : value,
    };

    setFilters(updatedFilters);

    fetchProperties(updatedFilters);
  };

  // Sort change
  const handleSortChange = (e) => {
    const newSort = e.target.value;

    const updatedFilters = {
      ...filters,
      sort: newSort,
    };

    setFilters(updatedFilters);

    fetchProperties(updatedFilters);
  };

  // Apply filters
  const applyFilters = () => {
    if (fetchTimer.current) {
      clearTimeout(fetchTimer.current);
    }

    fetchProperties(filters);
  };

  // Reset filters
  const resetFilters = () => {
    if (fetchTimer.current) {
      clearTimeout(fetchTimer.current);
    }

    const reset = {
      city: "",
      propertyType: [],
      bhk: "",
      maxPrice: 20000000,
      amenities: [],
      furnishing: [],
      sort: "latest",
    };

    setFilters(reset);

    navigate("/properties");

    fetchProperties(reset);
  };

  return (
    <div className={s.pageContainer}>
      <Navbar />

      <div className={s.container}>
        {/* Mobile Filter Button */}
        <div className={s.mobileFilterButtonWrapper}>
          <button
            className={s.mobileFilterButton}
            onClick={() => setShowMobileFilters(true)}
          >
            <HiFilter />
            Show Filter & Search
          </button>
        </div>

        <div className={s.layout}>
          {/* Sidebar */}
          <aside
            className={`${s.sidebar} ${
              showMobileFilters ? s.sidebarVisible : s.sidebarHidden
            }`}
          >
            {/* Sidebar Header */}
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

            {/* Filters */}
            <div className={s.filtersScrollArea}>
              {/* Location */}
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

              {/* Price */}
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
              <div className={s.filterSection}>
                <label className={s.filterLabel}>BHK (Bedroom)</label>

                <div className={s.bhkGroup}>
                  {bhkOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleBhkSelect(option)}
                      className={`${s.bhkButton} ${
                        filters.bhk === option
                          ? s.bhkButtonActive
                          : s.bhkButtonInactive
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.filterSection}>
                <label className={s.filterLabel}>Furnining</label>
                <div className={s.checkboxGroup}>
                  {furnishingOptions.map((option) => (
                    <label key={option.value} className={s.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filters.furnishing.includes(option.value)}
                        onChange={() =>
                          handleCheckboxChange("furnishing", option.value)
                        }
                        className={s.checkbox}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div className={s.filterSection}>
                <label className={s.filterLabel}>Property Types</label>

                <div className={s.checkbox}>
                  {propertyTypes.map((type) => (
                    <label key={type.value} className={s.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filters.propertyType.includes(type.value)}
                        onChange={() =>
                          handleCheckboxChange("propertyType", type.value)
                        }
                      />

                      {type.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Property Content */}
          <main className={s.mainContent}>
            <div className={s.contentHeader}>
              <div>
                <span className={s.resultCount}>
                  Showing{" "}
                  <strong className={s.resultCountStrong}>
                    {loading ? "..." : properties.length} Properties
                  </strong>
                </span>
              </div>
              <div className={s.headerControls}>
                <div className={s.viewModeToggle}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`${s.viewModeButton} ${viewMode === "grid" ? s.viewModeActive : s.viewModeInactive}
                    `}
                  >
                    <HiViewGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`${s.viewModeButton} ${viewMode === "list" ? s.viewModeActive : s.viewModeInactive}`}
                  >
                    <HiViewList size={20} />
                  </button>
                </div>
                <div className={s.sortControl}>
                  <span className={s.sortLabel}>Sort:</span>
                  <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className={s.sortSelect}
                  >
                    <option value="latest">Latest</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            {
              loading ? (
                <div className={s.skeletonGrid}>
                   {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={s.skeletonCard}></div>
                ))}
                </div>
              ) : error ?(
                <div className={s.errorContainer}>
                  <HiX size={48} className={s.errorIcon}/>
                  <h3 className={s.errorTitle}>{error}</h3>
                  <button onClick={applyFilters} className={s.errorButton}>
                    Try again
                  </button>
                </div>
              ): properties.length === 0 ? (
                <div className={s.emptyContainer}>
                  <div className={s.emptyIconWrapper}>
                    <HiAdjustments size={32} className={s.emptyIcon} />
                </div>
                <h2 className={s.emptyTitle}>No propperties Found</h2>
                <p className={s.emptyText}>
                  Broaded your search area
                </p>
                <button className={s.emptyButton} onClick={resetFilters}></button>
                </div>
              ):(
                <div className={`${s.propertyList} ${viewMode === "grid" ? s.propertyListGrid : s.propertyListList}`}>
                  {
                    properties.filter((p)=>p)
                    .map((p)=>(
                      <PropertyCard key={p._id} property={p} isWishlisted={wishListId.includes(p._id)}
                      onToggleWishlist={toggleWishList} />
                    ))
                  }
                </div>
              )}
          </main>
        </div>
      </div>
      {
        showMobileFilters && (
          <div className={s.mobileOverlay} onClick={()=>setShowMobileFilters(false)}></div>
        )
      }
    </div>
  );
};

export default Properties;
