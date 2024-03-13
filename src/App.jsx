import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { database } from "./Firebase";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Sign from "./components/Sign";
import Login from "./components/Login";
import Panel from "./components/Panel";
import ManageHouse from "./components/ManageHouse";
import About from "./components/About";
import Pricing from "./components/Pricing";
import "./style.css";
import Admin from "./components/Admin";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("User") || "{}")
  );
  const [loggedIn, setLoggedIn] = useState(!!user.email);
  const [isOwner, setIsOwner] = useState(false);
  const isAdmin = user.email === "admin@eyalb.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      if (currentUser) {
        const userDetailsPromise = fetchUserDetailsFromDatabase(
          currentUser.email.replace(/\./g, ",")
        );
        userDetailsPromise.then((userDetails) =>
          fetchHouseData(currentUser, userDetails)
        );
        setLoggedIn(true);
        setUser(currentUser);
        localStorage.setItem("User", JSON.stringify(currentUser));
      } else {
        setLoggedIn(false);
        setUser({});
        localStorage.removeItem("User");
        setIsOwner(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDetailsFromDatabase = async (email) => {
    const snapshot = await get(ref(database, `users/${email}`));
    return snapshot.exists() ? snapshot.val() : null;
  };

  const fetchHouseData = async (currentUser, userDetails) => {
    if (!userDetails || !userDetails.houseId) return;
    const snapshot = await get(ref(database, `Houses/${userDetails.houseId}`));
    const houseData = snapshot.val();
    setIsOwner(houseData && currentUser.email === houseData.owner);
    localStorage.setItem("UserDetails", JSON.stringify(userDetails));
  };

  return (
    <Router>
      <AuthContext.Provider value={{ loggedIn, user, isOwner, isAdmin }}>
        <Navbar />
        <div className="margin-top-site">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
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

export default App;
