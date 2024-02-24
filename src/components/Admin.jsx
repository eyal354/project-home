import { useState } from "react";
import { database } from "../Firebase.js";
import { ref, set } from "firebase/database";

function Admin() {
  const [houseId, setHouseId] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedEmail = ownerEmail.replace(/\./g, ",");

    const houseRef = ref(database, `Houses/${houseId}`);
    set(houseRef, {
      owner: ownerEmail,
      ApprovedUsers: {
        [sanitizedEmail]: {
          isHome: false,
          priority: 1,
        },
      },
      Rooms: {
        "Living Room": {
          TempRoom: 0, // Default temperature for Living Room
          LightLevelRoom: 0, // Default light level for Living Room
        },
      },
    })
      .then(() => {
        alert("House with default Living Room added successfully!");
      })
      .catch((error) => {
        alert("Failed to add house and Living Room: " + error.message);
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
          Owner Email:
          <input
            type="text"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add House</button>
      </form>
    </div>
  );
}

export default Admin;
