import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Mulish:wght@400;500;600&display=swap');

  .nb-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    font-family: 'Mulish', sans-serif;
    background: rgba(247, 244, 239, 0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1.5px solid rgba(26,26,26,0.09);
    transition: box-shadow 0.3s;
  }
  .nb-nav.scrolled {
    box-shadow: 0 4px 32px rgba(26,26,26,0.07);
  }

  .nb-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 28px;
    height: 90px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  /* Logo */
  .nb-logo {
    text-decoration: none;
    display: flex;
    align-items: baseline;
    gap: 1px;
    flex-shrink: 0;
  }
  .nb-logo-main {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
  .nb-logo-accent {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #c0392b;
    letter-spacing: -0.5px;
  }
  .nb-logo-dot {
    width: 6px;
    height: 6px;
    background: #c0392b;
    border-radius: 50%;
    margin-left: 3px;
    margin-bottom: 3px;
    flex-shrink: 0;
    align-self: flex-end;
  }

  /* Links */
  .nb-links {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    flex: 1;
    margin: 0;
    padding: 0;
  }
  .nb-link {
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 600;
    color: rgba(26,26,26,0.55);
    padding: 6px 12px;
    border-radius: 7px;
    transition: color 0.18s, background 0.18s;
    position: relative;
    white-space: nowrap;
    letter-spacing: 0.1px;
  }
  .nb-link:hover {
    color: #1a1a1a;
    background: rgba(26,26,26,0.06);
  }
  .nb-link.active {
    color: #c0392b;
    background: rgba(192,57,43,0.08);
    font-weight: 700;
  }

  /* Auth */
  .nb-auth { flex-shrink: 0; }
  .nb-logout, .nb-login {
    display: inline-flex;
    align-items: center;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 8px;
    padding: 9px 18px;
    cursor: pointer;
    transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
    text-decoration: none;
    border: none;
  }
  .nb-logout {
    background: #1a1a1a;
    color: #f7f4ef;
  }
  .nb-logout:hover {
    background: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(192,57,43,0.28);
  }
  .nb-login {
    background: transparent;
    color: #1a1a1a;
    border: 1.5px solid rgba(26,26,26,0.2);
  }
  .nb-login:hover {
    background: #1a1a1a;
    color: #f7f4ef;
    border-color: #1a1a1a;
    transform: translateY(-1px);
  }

  /* Mobile hamburger */
  .nb-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin-left: auto;
  }
  .nb-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #1a1a1a;
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
    transform-origin: center;
  }
  .nb-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nb-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nb-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile menu */
  .nb-mobile {
    display: none;
    flex-direction: column;
    gap: 2px;
    padding: 12px 20px 20px;
    border-top: 1px solid rgba(26,26,26,0.08);
    background: rgba(247,244,239,0.97);
    backdrop-filter: blur(16px);
  }
  .nb-mobile.open { display: flex; }
  .nb-mobile .nb-link {
    font-size: 14px;
    padding: 10px 14px;
    display: block;
  }
  .nb-mobile-auth { margin-top: 10px; padding: 0 2px; }
  .nb-mobile .nb-logout,
  .nb-mobile .nb-login { width: 100%; justify-content: center; }

  @media (max-width: 780px) {
    .nb-links { display: none; }
    .nb-auth { display: none; }
    .nb-hamburger { display: flex; }
  }
`;

const navItems = [
  { to: "/", label: "Home" },
  { to: "/display", label: "Food" },
  { to: "/inventory", label: "Inventory" },
  { to: "/recipeSearch", label: "Recipe Search" },
  { to: "/wasteAnalysis", label: "Waste Analysis" },
  { to: "/ecopro", label: "Kitchen Analytics" },
];

const Navbar = () => {
  const { loggedIn, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <style>{cssStyles}</style>
      <nav className={`nb-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nb-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <span className="nb-logo-main">Feed</span>
            <span className="nb-logo-accent">Forward</span>
            <span className="nb-logo-dot" />
          </Link>

          {/* Desktop links */}
          <ul className="nb-links">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nb-link${location.pathname === to ? " active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth */}
          <div className="nb-auth">
            {loggedIn ? (
              <button className="nb-logout" onClick={handleLogout}>Log Out</button>
            ) : (
              <Link to="/login" className="nb-login">Log In</Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nb-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile${menuOpen ? " open" : ""}`}>
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nb-link${location.pathname === to ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <div className="nb-mobile-auth">
            {loggedIn ? (
              <button className="nb-logout" onClick={handleLogout}>Log Out</button>
            ) : (
              <Link to="/login" className="nb-login">Log In</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;