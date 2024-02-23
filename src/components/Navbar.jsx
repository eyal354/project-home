import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../App";
import "../component-css/Navbar.css"; // Make sure to uncomment this and define the .active-link class

export function Navbar() {
  const { loggedIn, setLoggedIn, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        localStorage.setItem("loggedIn", "false");
        localStorage.removeItem("User");
        localStorage.removeItem("UserDetails");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" activeClassName="active-link">
          CasaAI
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav w-100">
            <NavLink
              className="nav-link"
              to="/home"
              activeClassName="active-link"
            >
              Home
            </NavLink>
            <NavLink
              className="nav-link"
              to="/features"
              activeClassName="active-link"
            >
              Features
            </NavLink>
            <NavLink
              className="nav-link"
              to="/pricing"
              activeClassName="active-link"
            >
              Pricing
            </NavLink>
            <NavLink
              className="nav-link"
              to="/about"
              activeClassName="active-link"
            >
              About
            </NavLink>

            <div className="navbar-nav ms-auto">
              {loggedIn ? (
                <>
                  <NavLink
                    className="nav-link"
                    to="/panel"
                    activeClassName="active-link"
                  >
                    User Panel
                  </NavLink>
                  {isOwner && (
                    <NavLink
                      className="nav-link"
                      to="/manage-house"
                      activeClassName="active-link"
                    >
                      Manage House
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-info"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    className="nav-link"
                    to="/sign"
                    activeClassName="active-link"
                  >
                    Sign Up
                  </NavLink>
                  <NavLink
                    className="nav-link"
                    to="/login"
                    activeClassName="active-link"
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
