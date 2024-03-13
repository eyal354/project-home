import { useEffect, useState, useContext } from "react";
import { database } from "../Firebase.js";
import { get, ref, onValue, set as firebaseSet } from "firebase/database";
import "../style.css";
import { AuthContext } from "../App";

const formatEmail = (email) => email.replace(/\./g, ",");

export default function UserID() {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({
    age: 0,
    firstname: "",
    lastname: "",
    pref: {},
  });
  const [lightLevelInput, setLightLevelInput] = useState(0);
  const [temperatureInput, setTemperatureInput] = useState(20);

  useEffect(() => {
    if (!user) return;
    const userDetailsLocal = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetailsLocal || !userDetailsLocal.houseId) return;

    const fetchUserData = async () => {
      const userRef = ref(database, `users/${formatEmail(user.email)}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setUserDetails(userData);
      }

      const prefRef = ref(
        database,
        `Houses/${userDetailsLocal.houseId}/ApprovedUsers/${formatEmail(
          user.email
        )}/pref`
      );
      onValue(prefRef, (snapshot) => {
        const prefData = snapshot.val();
        if (prefData) {
          setLightLevelInput(prefData.lightlevel || 0);
          setTemperatureInput(prefData.temperature || 20);
        }
      });
    };

    fetchUserData();
  }, [user]);

  const handleSliderChange = async (type, newValue) => {
    const userDetailsLocal = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetailsLocal || !userDetailsLocal.houseId) return;

    const newState =
      type === "lightlevel"
        ? setLightLevelInput(newValue)
        : setTemperatureInput(newValue);

    try {
      await firebaseSet(
        ref(
          database,
          `Houses/${userDetailsLocal.houseId}/ApprovedUsers/${formatEmail(
            user.email
          )}/pref/${type}`
        ),
        newValue
      );
    } catch (error) {
      console.error(`Failed to update ${type} level:`, error);
    }
    return newState;
  };

  const fullName = `${userDetails.firstname} ${userDetails.lastname}`;
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
            min="1"
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
