// Import necessary hooks and modules from React and Firebase.
import { useState, useEffect, useContext } from "react";
import { database } from "../Firebase";
import { update, ref, onValue, get, remove } from "firebase/database";
import { AuthContext } from "../App";
import "../component-css/UserList.css";

// Define the UserList component.
export default function UserList() {
  // Retrieve the current authenticated user's details from context.
  const { user } = useContext(AuthContext);
  // State hooks for managing component state.
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [ownerEmail, setOwnerEmail] = useState("");
  const [showRfidPopup, setShowRfidPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rfidKey, setRfidKey] = useState("");

  useEffect(() => {
    // Retrieve user details from local storage and fetch relevant data from Firebase.
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;

    // Fetch the owner's email from Firebase.
    get(ref(database, `Houses/${houseId}/owner`)).then((snapshot) => {
      if (snapshot.exists()) {
        setOwnerEmail(snapshot.val());
      }
    });

    // Subscribe to changes in the list of approved users and update state.
    const approvedUsersRef = ref(database, `Houses/${houseId}/ApprovedUsers`);
    const unsubscribe = onValue(approvedUsersRef, (snapshot) => {
      const approvedUsersData = snapshot.val() || {};
      const usersInfoPromises = Object.keys(approvedUsersData).map((userId) =>
        get(ref(database, `users/${userId}`)).then((userSnapshot) => {
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            return {
              userId,
              email: userData.email,
              isHome: approvedUsersData[userId].isHome,
              priority: approvedUsersData[userId].priority || 1,
              isOwner: userData.email === ownerEmail,
            };
          }
          return null;
        })
      );

      Promise.all(usersInfoPromises).then((usersInfo) => {
        setApprovedUsers(usersInfo.filter(Boolean));
      });
    });

    // Clean up subscription on component unmount.
    return () => unsubscribe();
  }, [user, ownerEmail]);

  // Event handlers for user actions like deleting or changing priority.
  const handleDelete = (userId) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;

    // Remove a user from Firebase based on userId.
    remove(ref(database, `Houses/${houseId}/ApprovedUsers/${userId}`)).catch(
      (error) => console.error("Error removing user", error)
    );
  };

  const handlePriorityChange = (userId, newPriority) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const updates = {};
    updates[`Houses/${userDetails.houseId}/ApprovedUsers/${userId}/priority`] =
      parseInt(newPriority, 10);

    // Update user priority in Firebase.
    update(ref(database), updates)
      .then(() => {
        setApprovedUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId
              ? { ...user, priority: parseInt(newPriority, 10) }
              : user
          )
        );
      })
      .catch((error) => console.error("Error updating priority", error));
  };

  const handleAddRfidKey = (userId) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;
    const updates = {};
    updates[`Houses/${houseId}/ApprovedUsers/${userId}/RfidKey`] = rfidKey;

    // Add or update an RFID key for a user in Firebase.
    update(ref(database), updates)
      .then(() => {
        setShowRfidPopup(false);
        setRfidKey("");
      })
      .catch((error) => console.error("Error adding RfidKey", error));
  };

  return (
    <>
      <div className="card approved-users">
        <div className="card-header">
          <h3>Approved Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {approvedUsers.map((user, index) => (
            <li key={user.userId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="user-info">
                  <span
                    className="home-indicator"
                    style={{
                      backgroundColor: user.isHome ? "green" : "red",
                      marginRight: "10px",
                    }}
                  >
                    <span className="tooltip-text">
                      {user.isHome ? "In Home" : "Not In Home"}
                    </span>
                  </span>
                  <span className="user-text">
                    {index + 1}. Email: {user.email}
                  </span>
                  {user.isOwner && <span> (Owner)</span>}
                </div>
                <div className="user-actions">
                  <select
                    className="form-control form-control-sm mr-2"
                    value={user.priority}
                    onChange={(e) =>
                      handlePriorityChange(user.userId, e.target.value)
                    }
                    style={{ display: "inline-block", width: "auto" }}
                  >
                    {[1, 2, 3, 4, 5].map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                  {!user.isOwner && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setCurrentUserId(user.userId);
                      setShowRfidPopup(true);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showRfidPopup && (
        <div className="rfid-popup-container">
          <div className="rfid-popup">
            <input
              type="text"
              value={rfidKey}
              onChange={(e) => setRfidKey(e.target.value)}
              placeholder="Enter RFID Key"
            />
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleAddRfidKey(currentUserId)}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setShowRfidPopup(false);
                setRfidKey("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
