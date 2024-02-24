import { useState } from "react";
import { database } from "../Firebase"; // Adjust the import path as needed
import { ref, set } from "firebase/database";

function AddHouse() {
  const [houseId, setHouseId] = useState("");
  const [ownerUid, setOwnerUid] = useState("");
  const [tempRoom, setTempRoom] = useState("");
  const [lightLevelRoom, setLightLevelRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const houseRef = ref(database, `Houses/${houseId}`);
    set(houseRef, {
      owner: ownerUid,
      ApprovedUsers: {
        [ownerUid]: {
          isHome: false, // Set default values or fetch from user's profile
          priority: 1, // Set default values or fetch from user's profile
        },
      },
      Room1: {
        TempRoom: tempRoom,
        LightLevelRoom: lightLevelRoom,
      },
    })
      .then(() => {
        alert("House and Room1 added successfully!");
      })
      .catch((error) => {
        alert("Failed to add house and Room1: " + error.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          House ID:
          <input
            type="text"
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            required
          />
        </label>
        <label>
          Owner UID:
          <input
            type="text"
            value={ownerUid}
            onChange={(e) => setOwnerUid(e.target.value)}
            required
          />
        </label>
        <label>
          Room1 Temperature:
          <input
            type="number"
            value={tempRoom}
            onChange={(e) => setTempRoom(e.target.value)}
            required
          />
        </label>
        <label>
          Room1 Light Level:
          <input
            type="number"
            value={lightLevelRoom}
            onChange={(e) => setLightLevelRoom(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add House</button>
      </form>
    </div>
  );
}

export default AddHouse;
