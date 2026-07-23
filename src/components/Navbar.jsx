import { useState } from "react";
import { navbarStyles as s } from "../assets/REAL-E-STATE/dummyStyles";
import Logo from "./Logo";
import { authUse } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { HiX, HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = authUse();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLink = (
    <>
      {(!user || user.role !== "buyer") && (
        <Link
          to="/properties"
          className={s.navLink}
          onClick={closeMenu}
        >
          Browse Properties
        </Link>
      )}

      {user && user.role === "buyer" && (
        <>
          <Link to="/" className={s.navLink} onClick={closeMenu}>
            Home
          </Link>

          <Link
            to="/properties"
            className={s.navLink}
            onClick={closeMenu}
          >
            Properties
          </Link>

          <Link
            to="/wishList"
            className={s.navLink}
            onClick={closeMenu}
          >
            Wishlist
          </Link>

          <Link
            to="/chat-message"
            className={s.navLink}
            onClick={closeMenu}
          >
            Message
          </Link>

          <Link
            to="/contact"
            className={s.navLink}
            onClick={closeMenu}
          >
            Contact Us
          </Link>
        </>
      )}

      {!user && (
        <>
          <Link
            to="/login"
            className={s.navLink}
            onClick={closeMenu}
          >
            Login
          </Link>

          <Link
            to="/register"
            className={s.navLink}
            onClick={closeMenu}
          >
            Register
          </Link>
        </>
      )}

      {user && user.role === "seller" && (
        <Link
          to="/dashboard"
          className={s.navLink}
          onClick={closeMenu}
        >
          Dashboard
        </Link>
      )}

      {user && user.role === "admin" && (
        <Link
          to="/admin-dashboard"
          className={s.navLink}
          onClick={closeMenu}
        >
          Admin Panel
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav className={s.nav}>
        <div className={s.container}>
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div>
              <Logo />
            </div>

            {/* Desktop Menu */}
            <div className={s.desktopMenu}>
              {navLink}
            </div>

            {/* Desktop User Section */}
            {user && (
              <div className="hidden lg:flex items-center gap-5">
                <Link to="/profile" className="flex items-center">
                  <img
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=0d6e59&color=fff`
                    }
                    alt="Profile"
                    className={s.avatar}
                  />
                </Link>

                <button
                  onClick={logout}
                  className={s.logoutButton}
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              type="button"
              className={s.mobileToggle}
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <HiX size={28} />
              ) : (
                <HiMenuAlt3 size={28} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      <div
        className={s.backdrop(isOpen)}
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <div className={s.drawer(isOpen)}>
        
        {/* Drawer Header */}
        <div className={s.drawerHeader}>
          <Logo />

          <button
            type="button"
            className={s.drawerCloseIcon}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <HiX size={28} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <div className={s.drawerNavLinks}>
          {navLink}
        </div>

        {/* Drawer User Section */}
        {user && (
          <div className={s.drawerUserSection}>
            <div className={s.drawerUserInfo}>
              <img
                src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=0d6e59&color=fff`
                }
                alt="User Avatar"
                className={s.drawerAvatar}
              />

              <div>
                <div className={s.drawerUserName}>
                  {user.name}
                </div>

                <div className={s.drawerUserEmail}>
                  {user.email}
                </div>
              </div>
            </div>

            <button
              className={s.drawerLogoutButton}
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;