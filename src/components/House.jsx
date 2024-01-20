import { database } from "../Firebase.js";
import { ref, onValue } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import "../style.css";

export default function House() {
  const { loggedIn } = useContext(AuthContext);
  const [data, setData] = useState({
    LightLevelRoom: 0,
    TempRoom: 0,
  });

  useEffect(() => {
    // Retrieve UserDetails from local storage
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId; // Use optional chaining in case UserDetails or houseId is not present

    if (loggedIn && houseId) {
      const houseRef = ref(database, `Houses/${houseId}/Room1`);
      const unsubscribe = onValue(houseRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
      });

      return () => unsubscribe();
    }
  }, [loggedIn]);

  return (
    <div className="data-display">
      <h2>Data-display</h2>
      <p>
        <strong>Light Level:</strong> {data.LightLevelRoom}
      </p>
      <p>
        <strong>Temp:</strong> {data.TempRoom}
      </p>
    </div>
  );
}
