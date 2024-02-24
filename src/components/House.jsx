import { database } from "../Firebase.js";
import { ref, onValue } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
// import "../style.css";

export default function House() {
  const { loggedIn } = useContext(AuthContext);
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;

    if (loggedIn && houseId) {
      const roomsRef = ref(database, `Houses/${houseId}/Rooms`);
      onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val();
        const roomsArray = Object.keys(rooms).map((roomName) => ({
          name: roomName,
          ...rooms[roomName],
        }));
        setRoomsData(roomsArray);
      });
    }
  }, [loggedIn]);

  return (
    <div>
      {roomsData.map((room) => (
        <div key={room.name} className="card pa">
          <div className="card-header">
            <h2>Data Display for {room.name}</h2>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Light Level:</strong> {room.LightLevelRoom}
            </p>
            <p className="card-text">
              <strong>Temp:</strong> {room.TempRoom}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
