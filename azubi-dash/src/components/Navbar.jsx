import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // Redirect to the login page
    navigate("/login");
  };

  const handleRedirectToHome = () => {
    // Redirect to /home when Azubi-Dash is clicked
    navigate("/home");
  };

  useEffect(() => {
    let elements = document.getElementById("admin-dropdown");
    document.addEventListener("click", (e) => {
      if (elements && !elements.contains(e.target) && elements.open) {
        elements.open = false;
      }
    });
  }, []);

  return (
    <div className="drawer">
      {/* This checkbox will control opening/closing the drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area (with the top Navbar) */}
      <div className="drawer-content flex flex-col">
        {/* -- Navbar -- */}
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            {/* Hamburger button (shown on smaller screens) */}
            <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>

            {/* Logo or title - Clickable to go to home */}
            <a
              className="btn btn-ghost text-xl cursor-pointer"
              onClick={handleRedirectToHome}
            >
              Azubi-Dash
            </a>
          </div>

          {/* Desktop navbar items */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/kalender">Kalender</Link>
              </li>
              <li>
                <Link to="/grades">Noteneintragung</Link>
              </li>
              <li>
                <Link to="/reports">Berichtsheft</Link>
              </li>
              <li className="relative">
                <details className="dropdown" id="admin-dropdown">
                  <summary className="cursor-pointer">Admin</summary>
                  <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 absolute z-50">
                    <li>
                      <Link to="/verwaltung">Verwaltung</Link>
                    </li>
                    <li>
                      <Link to="/notenuebersicht">Notenübersicht</Link>
                    </li>
                    <li>
                      <Link to="/class-management">Klasseneinteilung</Link>
                    </li>
                    <li>
                      <Link to="/subjects">Fächerzuweisung</Link>
                    </li>
                    <li>
                      <Link to="/kalenderuebersicht">Kalenderübersicht</Link>
                    </li>
                    <li>
                      <Link to="/review-reports">Berichtsheftgenehmigung</Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <div className="navbar-end">
            <button onClick={handleLogout} className="btn">
              Ausloggen
            </button>
          </div>
        </div>

        {/* 
          Below this Navbar, you can include other content in your page’s main area 
          if desired. 
        */}
        <div className="p-4">{/* Page content, routes, etc. */}</div>
      </div>

      {/* Sidebar (drawer) menu -- appears when the checkbox is checked */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <ul className="menu p-4 w-64 bg-base-100">
          <li>
            <Link to="/kalender">Kalender</Link>
          </li>
          <li>
            <Link to="/grades">Noteneintragung</Link>
          </li>
          <li>
            <Link to="/reports">Berichtsheft</Link>
          </li>
          <li>
            {/* Same Admin dropdown content, but you can also simplify 
                for mobile if you prefer. */}
            <details className="dropdown">
              <summary className="cursor-pointer">Admin</summary>
              <ul className="p-2">
                <li>
                  <Link to="/verwaltung">Verwaltung</Link>
                </li>
                <li>
                  <Link to="/notenuebersicht">Notenübersicht</Link>
                </li>
                <li>
                  <Link to="/class-management">Klasseneinteilung</Link>
                </li>
                <li>
                  <Link to="/subjects">Fächerzuweisung</Link>
                </li>
                <li>
                  <Link to="/kalenderuebersicht">Kalenderübersicht</Link>
                </li>
                <li>
                  <Link to="/review-reports">Berichtsheftgenehmigung</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
