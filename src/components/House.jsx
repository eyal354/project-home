import { database } from "../Firebase.js";
import { ref, set, onValue, remove } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { Trash2 } from "lucide-react";

// import "../style.css";

export default function House() {
  const { loggedIn } = useContext(AuthContext);
  const [roomsData, setRoomsData] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false); // To toggle input visibility

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;

    if (loggedIn && houseId) {
      const roomsRef = ref(database, `Houses/${houseId}/Rooms`);
      onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val() || {};
        const roomsArray = Object.keys(rooms).map((roomName) => ({
          name: roomName,
          ...rooms[roomName],
        }));
        setRoomsData(roomsArray);
      });
    }
  }, [loggedIn]);

  const addRoom = () => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;

    if (houseId && newRoomName.trim()) {
      const newRoomRef = ref(
        database,
        `Houses/${houseId}/Rooms/${newRoomName}`
      );
      set(newRoomRef, { LightLevelRoom: 0, TempRoom: 0 })
        .then(() => {
          setNewRoomName(""); // Clear input field
          setShowAddRoom(false); // Hide input field
        })
        .catch((error) => {
          alert("Failed to add room: " + error.message);
        });
    }
  };

  const editRoom = (oldRoomName) => {
    const newRoomName = prompt("Enter the new room name:", oldRoomName);
    if (newRoomName && newRoomName !== oldRoomName) {
      const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
      const houseId = userDetails?.houseId;

      // Update room name
      const oldRoomRef = ref(
        database,
        `Houses/${houseId}/Rooms/${oldRoomName}`
      );
      const newRoomRef = ref(
        database,
        `Houses/${houseId}/Rooms/${newRoomName}`
      );
      onValue(oldRoomRef, (snapshot) => {
        const roomData = snapshot.val();
        set(newRoomRef, roomData); // Set new room with old data
        remove(oldRoomRef); // Remove old room
      });
    }
  };

  const deleteRoom = (roomName) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;
    const roomRef = ref(database, `Houses/${houseId}/Rooms/${roomName}`);
    remove(roomRef)
      .then(() => {
        alert(`${roomName} deleted successfully.`);
      })
      .catch((error) => {
        alert("Failed to delete room: " + error.message);
      });
  };

  return (
    <div>
      <button onClick={() => setShowAddRoom(!showAddRoom)}>+ Add Room</button>
      {showAddRoom && (
        <div>
          <input
            type="text"
            placeholder="Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button onClick={addRoom}>Submit</button>
        </div>
      )}
      {roomsData.map((room) => (
        <div key={room.name} className="card pa">
          <div className="card-header">
            <h2>Data Display for {room.name}</h2>
            <button onClick={() => editRoom(room.name)}>Edit</button>
            <button onClick={() => deleteRoom(room.name)}>
              <Trash2 />
            </button>
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
