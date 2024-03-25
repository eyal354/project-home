import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { database } from "./Firebase"; // Import database configuration
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Sign from "./components/Sign";
import Login from "./components/Login";
import Panel from "./components/Panel";
import ManageHouse from "./components/ManageHouse";
import About from "./components/About";
import Pricing from "./components/Pricing";
import "./style.css"; // Import global styles
import Admin from "./components/Admin";

export const AuthContext = createContext(); // Create a context for authentication

function App() {
  // User state to store user details
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("User") || "{}")
  );
  // State to track whether a user is logged in
  const [loggedIn, setLoggedIn] = useState(!!user.email);
  // State to determine if the logged-in user is an owner of any house
  const [isOwner, setIsOwner] = useState(false);
  // Determine if the user is an admin based on their email
  const isAdmin = user.email === "admin@eyalb.com";

  // Effect to handle Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      if (currentUser) {
        // Fetch user details from the database if a user is logged in
        const userDetailsPromise = fetchUserDetailsFromDatabase(
          currentUser.email.replace(/\./g, ",")
        );
        userDetailsPromise.then((userDetails) =>
          fetchHouseData(currentUser, userDetails)
        );

        setLoggedIn(true);
        setUser(currentUser);
        localStorage.setItem("User", JSON.stringify(currentUser)); // Store user data in local storage
      } else {
        // Reset state and local storage if no user is logged in
        setLoggedIn(false);
        setUser({});
        localStorage.removeItem("User");
        setIsOwner(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [loggedIn]);

  // Fetch user details from Firebase Database
  const fetchUserDetailsFromDatabase = async (email) => {
    const snapshot = await get(ref(database, `users/${email}`));
    return snapshot.exists() ? snapshot.val() : null;
  };

  // Fetch house data to determine if the user is the house owner
  const fetchHouseData = async (currentUser, userDetails) => {
    if (!userDetails || !userDetails.houseId) return;
    const snapshot = await get(ref(database, `Houses/${userDetails.houseId}`));
    const houseData = snapshot.val();
    setIsOwner(houseData && currentUser.email === houseData.owner);
    localStorage.setItem("UserDetails", JSON.stringify(userDetails)); // Store user details in local storage
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{ loggedIn, user, isOwner, isAdmin, setLoggedIn }}
      >
        <Navbar /> {/* Navigation bar */}
        <div className="margin-top-site">
          <Routes>
            {/* Route definitions for different pages in the application */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            {/* Conditional rendering based on user roles */}
            {loggedIn &&
              (isAdmin ? (
                <Route path="/panel" element={<Admin />} />
              ) : (
                <Route path="/panel" element={<Panel />} />
              ))}
            {loggedIn && isOwner && (
              <Route path="/manage-house" element={<ManageHouse />} />
            )}
          </Routes>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App; // Export App component as default
