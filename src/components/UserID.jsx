import { useEffect, useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { database } from "../Firebase.js";
import { get, ref, onValue, set as firebaseSet } from "firebase/database";
import "../style.css";
import { AuthContext } from "../App";

export default function UserID() {
  const auth = getAuth();
  const { loggedIn, user } = useContext(AuthContext);
  const [UserDetails, setUserDetails] = useState({
    age: 0,
    firstname: "",
    lastname: "",
    pref: {},
  });
  const [lightLevelInput, setLightLevelInput] = useState(0);
  const [temperatureInput, setTemperatureInput] = useState(20);

  useEffect(() => {
    if (user) {
      const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
      if (!userDetails || !userDetails.houseId) return;

      // Fetch user's basic information
      const userRef = ref(database, `users/${user.uid}`);
      get(userRef).then((userSnapshot) => {
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            age: userData.age,
            firstname: userData.firstname,
            lastname: userData.lastname,
          }));
        }
      });

      // Fetch user's preferences
      const prefRef = ref(
        database,
        `Houses/${userDetails.houseId}/ApprovedUsers/${user.uid}/pref`
      );
      const unsubscribe = onValue(prefRef, (snapshot) => {
        const fetchedData = snapshot.val();
        if (fetchedData) {
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            pref: fetchedData,
          }));
          setLightLevelInput(fetchedData.lightlevel || 0);
          setTemperatureInput(fetchedData.temperature || 20);
        } else {
          console.log("No preference data available");
          setLightLevelInput(0);
          setTemperatureInput(20);
        }
      });
      return () => unsubscribe();
    }
  }, [auth, loggedIn, user]);

  const handleSliderChange = async (type, newValue) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    if (type === "lightlevel") {
      setLightLevelInput(newValue);
    } else if (type === "temperature") {
      setTemperatureInput(newValue);
    }

    try {
      await firebaseSet(
        ref(
          database,
          `Houses/${userDetails.houseId}/ApprovedUsers/${user.uid}/pref/${type}`
        ),
        newValue
      );
    } catch (error) {
      console.error(`Failed to update ${type} level:`, error);
    }
  };

  const fullName = UserDetails.firstname + " " + UserDetails.lastname;
  const bulbOpacity = lightLevelInput / 100;

  return (
    <div className="card data-send">
      <div className="card-header">
        <h2>
          {" "}
          Preferences for the user: <strong>{fullName}</strong>{" "}
        </h2>
      </div>
      <div className="card-body">
        <div className="light-level-control mb-3">
          <strong>Light Level:</strong>
          <input
            type="range"
            className="custom-range"
            min="0"
            max="100"
            value={lightLevelInput}
            onChange={(e) =>
              handleSliderChange("lightlevel", parseInt(e.target.value, 10))
            }
          />
          <div className="light-bulb" style={{ opacity: bulbOpacity }} />
        </div>
        <div className="temperature-control">
          <strong>Temperature:</strong>
          <input
            type="range"
            className="custom-range"
            min="15"
            max="30"
            value={temperatureInput}
            onChange={(e) =>
              handleSliderChange("temperature", parseInt(e.target.value, 10))
            }
          />
          <span className="temperature-value">{temperatureInput}°C</span>
        </div>
      </div>
    </div>
  );
}
