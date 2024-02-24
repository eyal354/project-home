import { useState } from "react";
import { database } from "../Firebase"; // Adjust the import path as needed
import { ref, set } from "firebase/database";

function AddHouse() {
  const [houseId, setHouseId] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensuring the email is compatible with Firebase keys by replacing '.' with ','
    const sanitizedEmail = ownerEmail.replace(/\./g, ",");

    const houseRef = ref(database, `Houses/${houseId}`);
    set(houseRef, {
      owner: ownerEmail,
      ApprovedUsers: {
        [sanitizedEmail]: {
          // Using the sanitized email as the key
          isHome: false,
          priority: 1,
        },
      },
      LivingRoom: {
        TempRoom: 0, // Default temperature preference for Living Room
        LightLevelRoom: 0, // Default light level preference for Living Room
      },
    })
      .then(() => {
        alert(
          "House and Living Room added successfully with default preferences!"
        );
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

export default AddHouse;
