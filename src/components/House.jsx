// Imports necessary React hooks, Firebase database operations, and context from other modules
import { database } from "../Firebase.js";
import { ref, set, onValue, remove } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { Trash2 } from "lucide-react";

// import "../style.css";

// Defines the House component
export default function House() {
  // Destructures loggedIn from the AuthContext to manage authentication state
  const { loggedIn } = useContext(AuthContext);

  // useState hooks to manage local state for rooms data, new room name, and toggling the add room input
  const [roomsData, setRoomsData] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);

  // useEffect hook to fetch rooms data from Firebase when the component mounts or loggedIn state changes
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

  // Function to add a new room to the Firebase database
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
          setNewRoomName(""); // Clear the input field after adding a room
          setShowAddRoom(false); // Hide the input field after adding a room
        })
        .catch((error) => {
          alert("Failed to add room: " + error.message);
        });
    }
  };

  // Function to delete a room from the Firebase database
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
      {roomsData.map((room) => (
        <div key={room.name} className="card pa">
          <div className="card-header">
            <h2>Data Display for {room.name}</h2>
            <button
              className="btn btn-danger"
              onClick={() => deleteRoom(room.name)}
            >
              <Trash2 />
            </button>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>
                <i className="fa-solid fa-lightbulb"></i> Light Level:
              </strong>{" "}
              {room.LightLevelRoom}
            </p>
            <p className="card-text">
              <strong>❆ Temp:</strong> {room.TempRoom}
            </p>
          </div>
        </div>
      ))}
      <button
        className="btn btn-primary"
        onClick={() => setShowAddRoom(!showAddRoom)}
      >
        + Add Room
      </button>
      {showAddRoom && (
        <div>
          <input
            type="text"
            placeholder="Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addRoom}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
