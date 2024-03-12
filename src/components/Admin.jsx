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
      logs: {},
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-black text-white">
              <h4 className="mb-0">Add a New House</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="houseIdInput" className="form-label">
                    House ID:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="houseIdInput"
                    value={houseId}
                    onChange={(e) => setHouseId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ownerEmailInput" className="form-label">
                    Owner Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="ownerEmailInput"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
