import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../App";
import "../component-css/Navbar.css"; // Make sure to uncomment this if you have custom CSS

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          CasaAI
        </Link>
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
            <Link className="nav-link active" aria-current="page" to="/home">
              Home
            </Link>
            <Link className="nav-link" to="/features">
              Features
            </Link>
            <Link className="nav-link" to="/pricing">
              Pricing
            </Link>
            <Link className="nav-link" to="/about">
              About
            </Link>
          </div>
          <div className="navbar-nav text-center">
            {loggedIn ? (
              <>
                <Link className="nav-link" to="/panel">
                  User Panel
                </Link>
                {isOwner && (
                  <Link className="nav-link" to="/manage-house">
                    Manage House
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline-info">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/sign">
                  Sign Up
                </Link>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
