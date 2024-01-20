import { ref, get, update, onValue } from "firebase/database";
import { database } from "../Firebase";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import "../style.css";

export default function PendingRequests() {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;
    const pendingRequestsRef = ref(
      database,
      `Houses/${houseId}/PendingRequest`
    );

    const unsubscribe = onValue(pendingRequestsRef, async (snapshot) => {
      const requestKeys = snapshot.val() || {};
      const fetchedRequests = [];

      for (const userId in requestKeys) {
        // The key is the userId in this structure
        const userRef = ref(database, `users/${userId}`);
        const userSnap = await get(userRef);
        if (userSnap.exists()) {
          fetchedRequests.push({
            userId: userId,
            email: userSnap.val().email,
          });
        }
      }

      setPendingRequests(fetchedRequests);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRequest = (userId, approve) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;

    const updates = {};
    if (approve) {
      updates[`Houses/${houseId}/ApprovedUsers/${userId}`] = {
        RfidKey: "",
        isHome: false,
      };
    }
    updates[`Houses/${houseId}/PendingRequest/${userId}`] = null;

    update(ref(database), updates)
      .then(() => {
        console.log("Request processed");
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.userId !== userId)
        );
      })
      .catch((error) => console.error("Error processing request", error));
  };

  return (
    <div className="pending-requests">
      <h3>Pending Requests</h3>
      <ul>
        {pendingRequests.map(({ userId, email }, index) => (
          <li key={userId} className="request-item">
            <span className="request-text">
              {index + 1}. {email}
            </span>
            <button
              className="approve-btn"
              onClick={() => handleRequest(userId, true)}
            >
              Approve
            </button>
            <button
              className="delete-btn"
              onClick={() => handleRequest(userId, false)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
