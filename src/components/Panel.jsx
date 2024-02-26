import { useEffect, useState, useContext } from "react";
import { database } from "../Firebase.js";
import { get, ref } from "firebase/database";
import { AuthContext } from "../App";
import UserID from "./UserID.jsx";
import House from "./House.jsx";

function Panel() {
  const { user } = useContext(AuthContext);
  const [isUserApproved, setIsUserApproved] = useState(null); // null initially to handle loading state

  useEffect(() => {
    if (user) {
      const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
      if (!userDetails || !userDetails.houseId) {
        setIsUserApproved(false); // Set to false if there's no house ID in the user details
        return;
      }

      const approvedUsersRef = ref(
        database,
        `Houses/${userDetails.houseId}/ApprovedUsers`
      );
      get(approvedUsersRef).then((snapshot) => {
        const approvedUsers = snapshot.val();
        const userKey = user.email.replace(/\./g, ",");
        setIsUserApproved(!!approvedUsers && !!approvedUsers[userKey]);
      });
    } else {
      setIsUserApproved(false); // Set to false if there's no user logged in
    }
  }, [user]);

  if (isUserApproved === null) {
    return <div>Loading...</div>; // Or any other loading state representation
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
    </div>
  );
}

export default Panel;
