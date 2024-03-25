import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../App";
import "../component-css/Navbar.css";

export function Navbar() {
  const { loggedIn, setLoggedIn, isOwner, isAdmin } = useContext(AuthContext);
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
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
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav text-center">
            <NavLink
              className="nav-link"
              aria-current="page"
              to="/home"
              activeclassname="active"
            >
              Home
            </NavLink>

            <NavLink
              className="nav-link"
              to="/pricing"
              activeclassname="active"
            >
              Pricing
            </NavLink>
            <NavLink className="nav-link" to="/about" activeclassname="active">
              About
            </NavLink>
          </div>
          <div className="navbar-nav text-center">
            {loggedIn ? (
              <>
                <NavLink
                  className="nav-link"
                  to="/panel"
                  activeclassname="active"
                >
                  {isAdmin ? "Admin Panel" : "User Panel"}
                </NavLink>
                {isOwner && (
                  <NavLink
                    className="nav-link"
                    to="/manage-house"
                    activeclassname="active"
                  >
                    Manage House
                  </NavLink>
                )}
                <button onClick={handleLogout} className="btn btn-outline-info">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  className="nav-link"
                  to="/sign"
                  activeclassname="active"
                >
                  Sign Up
                </NavLink>
                <NavLink
                  className="nav-link"
                  to="/login"
                  activeclassname="active"
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
