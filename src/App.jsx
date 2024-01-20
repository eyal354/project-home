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
import "./style.css";

export const AuthContext = createContext();

function App() {
  const auth = getAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoggedIn(true);
        setUser(currentUser);
        localStorage.setItem("User", JSON.stringify(currentUser));

        // Fetch user details from the database
        const userDetails = await fetchUserDetailsFromDatabase(currentUser.uid);
        await fetchHouseData(currentUser, userDetails);
      } else {
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem("User");
        setIsOwner(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch user details from Firebase Database
  const fetchUserDetailsFromDatabase = async (uid) => {
    const userRef = ref(database, `users/${uid}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No user details available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  // Fetch house data and determine if the user is the owner
  const fetchHouseData = async (currentUser, userDetails) => {
    if (userDetails && userDetails.houseId) {
      const houseRef = ref(database, `Houses/${userDetails.houseId}`);
      try {
        const snapshot = await get(houseRef);
        const houseData = snapshot.val();
        setIsOwner(houseData && currentUser.uid === houseData.owner);

        // Update localStorage with the latest userDetails
        localStorage.setItem("UserDetails", JSON.stringify(userDetails));
      } catch (error) {
        console.error("Error fetching house data:", error);
      }
    }
  };

  return (
    <>
      <Router>
        <AuthContext.Provider
          value={{ loggedIn, setLoggedIn, user, setUser, isOwner }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            {loggedIn && <Route path="/panel" element={<Panel />} />}
            {loggedIn && isOwner && (
              <Route path="/manage-house" element={<ManageHouse />} />
            )}
          </Routes>
        </AuthContext.Provider>
      </Router>
    </>
  );
}

export default App;