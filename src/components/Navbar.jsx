import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../App";
import "../component-css/Navbar.css";

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
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        {loggedIn ? (
          <>
            <li>
              {" "}
              <Link to="/panel">User Panel</Link>{" "}
            </li>
            {isOwner && (
              <li>
                <Link to="/manage-house">Manage House</Link>
              </li>
            )}
            <li>
              {" "}
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sign">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
