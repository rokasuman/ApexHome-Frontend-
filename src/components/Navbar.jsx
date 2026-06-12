import { useState } from "react";
import { navbarStyles as s } from "../assets/REAL-E-STATE/dummyStyles";
import Logo from "./Logo";
import { authUse } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = authUse();

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // NavLinks for different user states
  const navLink = (
    <>
      {(!user || user.role !== "buyer") && (
        <Link
          to="/properties"
          className={s.navLink}
          onClick={() => setIsOpen(false)}
        >
          Browse Properties
        </Link>
      )}

      {user && user.role === "buyer" && (
        <>
          <Link to="/" className={s.navLink} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/properties"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>
          <Link
            to="/wishList"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            to="/chat-message"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Message
          </Link>
          <Link
            to="/contact"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </>
      )}
      {user && user.role === "seller" && (
        <>
          <Link
            to="/dashboard"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </>
      )}
      {user && user.role === "admin" && (
        <>
          <Link
            to="/admin-dashboard"
            className={s.navLink}
            onClick={() => setIsOpen(false)}
          >
            Admin Panel
          </Link>
        </>
      )}
    </>
  );

  return (
  <>
  <nav className={s.nav}>
  <div className={s.container}>
    <div className="flex justify-between items-center">
      {/* Logo */}
      <div className="justify-self-start">
        <Logo />
      </div>

      {/* Desktop Menu */}
      <div className={s.desktopMenu}>
        {navLink}
      </div>

      {/* User Section */}
      <div>
        {user ? (
          <Link to="/profile" className="flex items-center">
            <img
              src={
                user.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d6e59&color=fff`
              }
              alt="Profile"
              className={s.avatar}
            />
            <button onClick={logout} className={s.logoutButton}>
              Logout
            </button>
          </Link>
        ) : null}
      </div>

      {/* Mobile Toggle Button  */}
      <div className={s.mobileToggle} onClick={toggleMenu}>
        ☰ 
      </div>
    </div>
  </div>

  {/* Mobile Backdrop */}
  <div className={s.backdrop(isOpen)} onClick={toggleMenu}></div>

  {/* Mobile Drawer */}
  <div className={s.drawer(isOpen)}>
    <div className={s.drawerHeader}>
      <div className="text-xl font-semibold">Menu</div>
      <div className={s.drawerCloseIcon} onClick={toggleMenu}>
        ✕
      </div>
    </div>
    <div className={s.drawerNavLinks}>
      {navLink}
    </div>
    {user && (
      <div className={s.drawerUserSection}>
        <div className={s.drawerUserInfo}>
          <img
            src={
              user.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d6e59&color=fff`
            }
            alt="User Avatar"
            className={s.drawerAvatar}
          />
          <div className={s.drawerUserName}>{user.name}</div>
          <div className={s.drawerUserEmail}>{user.email}</div>
        </div>
        <button className={s.drawerLogoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    )}
  </div>
</nav>
  </>
  );
};

export default Navbar;