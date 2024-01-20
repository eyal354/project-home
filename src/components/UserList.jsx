import { useState, useEffect, useContext } from "react";
import { database } from "../Firebase";
import { ref, onValue, get, update } from "firebase/database";
import { AuthContext } from "../App";
import "../component-css/UserList.css";

export default function UserList() {
  const { user } = useContext(AuthContext);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [ownerId, setOwnerId] = useState(null); // State to store the owner's ID

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;

    // Fetch the owner's ID
    get(ref(database, `Houses/${houseId}/owner`)).then((snapshot) => {
      if (snapshot.exists()) {
        setOwnerId(snapshot.val());
      }
    });

    const approvedUsersRef = ref(database, `Houses/${houseId}/ApprovedUsers`);
    const unsubscribe = onValue(approvedUsersRef, (snapshot) => {
      const approvedUsersData = snapshot.val() || {};
      Promise.all(
        Object.entries(approvedUsersData).map(([userId, userData]) =>
          get(ref(database, `users/${userId}`)).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              return {
                userId,
                email: userSnapshot.val().email,
                isHome: userData.isHome,
                priority: userData.priority || 1,
                isOwner: userId === ownerId, // Check if this user is the owner
              };
            }
            return null;
          })
        )
      ).then((usersInfo) => {
        setApprovedUsers(usersInfo.filter(Boolean));
      });
    });

    return () => unsubscribe();
  }, [user, ownerId]);

  const handleDelete = (userId) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;
    const updates = {};
    updates[`Houses/${houseId}/ApprovedUsers/${userId}`] = null;

    update(ref(database), updates)
      .then(() => {
        setApprovedUsers((prevUsers) =>
          prevUsers.filter((user) => user.userId !== userId)
        );
      })
      .catch((error) => console.error("Error removing user", error));
  };

  const handlePriorityChange = (userId, newPriority) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const updates = {};
    updates[`Houses/${userDetails.houseId}/ApprovedUsers/${userId}/priority`] =
      parseInt(newPriority, 10);

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

  return (
    <div className="approved-users">
      <h3>Approved Users</h3>
      <ul>
        {approvedUsers.map((user, index) => (
          <li key={user.userId} className="user-item">
            <span
              className="home-indicator"
              style={{ backgroundColor: user.isHome ? "green" : "red" }}
            >
              <span className="tooltip-text">
                {user.isHome ? "In Home" : "Not In Home"}
              </span>
            </span>
            <span className="user-text">
              {index + 1}. Email: {user.email}
            </span>
            <select
              value={user.priority}
              onChange={(e) =>
                handlePriorityChange(user.userId, e.target.value)
              }
            >
              {[1, 2, 3, 4, 5].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {!user.isOwner && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(user.userId)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
