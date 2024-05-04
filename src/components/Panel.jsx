import { useEffect, useState, useContext } from "react";
import { database } from "../Firebase.js";
import { get, ref, onValue } from "firebase/database";
import { AuthContext } from "../App";
import UserID from "./UserID.jsx";
import House from "./House.jsx";
import Remote from "./Remote.jsx"; // Ensure Remote is imported

function Panel() {
  const { user } = useContext(AuthContext);
  const [isUserApproved, setIsUserApproved] = useState(null);
  const [manualSettings, setManualSettings] = useState(false); // Track manual settings for Remote

  useEffect(() => {
    if (user) {
      const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
      if (!userDetails || !userDetails.houseId) {
        setIsUserApproved(false);
        return;
      }

      const houseId = userDetails.houseId;
      const approvedUsersRef = ref(database, `Houses/${houseId}/ApprovedUsers`);
      const manualSettingsRef = ref(
        database,
        `Houses/${houseId}/ControlSettings/manualSettings`
      );

      get(approvedUsersRef).then((snapshot) => {
        const approvedUsers = snapshot.val();
        const userKey = user.email.replace(/\./g, ",");
        setIsUserApproved(!!approvedUsers && !!approvedUsers[userKey]);
      });

      // Fetch and monitor manual settings
      onValue(manualSettingsRef, (snapshot) => {
        setManualSettings(!!snapshot.val()); // Convert to boolean explicitly
      });
    } else {
      setIsUserApproved(false);
    }
  }, [user]);

  if (isUserApproved === null) {
    return <div>Loading...</div>;
  }

  if (!isUserApproved) {
    return (
      <div className="container panel">
        <h1 className="display-1 text-center my-4">User not in house</h1>
      </div>
    );
  }

  return (
    <div className="container panel">
      <h1 className="display-1 text-center my-4">Panel</h1>
      <div className="row mb-3">
        <div className="col-12">
          <House />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12">
          <UserID />
        </div>
      </div>
      {manualSettings && ( // Conditionally render Remote based on manualSettings
        <div className="row mb-3">
          <div className="col-12">
            <Remote />
          </div>
        </div>
      )}
    </div>
  );
}

export default Panel;
