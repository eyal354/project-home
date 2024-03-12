import { ref, get, update, onValue } from "firebase/database";
import { database } from "../Firebase";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";

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

    const unsubscribe = onValue(pendingRequestsRef, (snapshot) => {
      const requests = snapshot.val() || {};
      const userIds = Object.keys(requests);

      Promise.all(
        userIds.map((userId) =>
          get(ref(database, `users/${userId}`)).then((userSnap) =>
            userSnap.exists() ? { userId, email: userSnap.val().email } : null
          )
        )
      ).then((fetchedRequests) => {
        setPendingRequests(fetchedRequests.filter(Boolean));
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleRequest = async (userId, approve) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const houseId = userDetails.houseId;
    const updates = {
      [`Houses/${houseId}/PendingRequest/${userId}`]: null,
      ...(approve && {
        [`Houses/${houseId}/ApprovedUsers/${userId}`]: {
          RfidKey: "",
          isHome: false,
        },
      }),
    };

    try {
      await update(ref(database), updates);
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId)
      );
    } catch (error) {
      console.error("Error processing request", error);
    }
  };

  return (
    <div className="card pending-requests">
      <div className="card-header">
        <h3>Pending Requests</h3>
      </div>
      <ul className="list-group list-group-flush">
        {pendingRequests.map(({ userId, email }, index) => (
          <li
            key={userId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className="request-text">
              {index + 1}. {email}
            </span>
            <div>
              <button
                className="btn btn-success btn-sm mr-2"
                onClick={() => handleRequest(userId, true)}
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={() => handleRequest(userId, false)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
