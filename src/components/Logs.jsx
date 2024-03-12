import { useState, useEffect } from "react";
import { database } from "../Firebase";
import { ref, get, onValue } from "firebase/database";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [logKeys, setLogKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState(0); // Use pageIndex to track the current page

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (!userDetails || !userDetails.houseId) return;

    const logsRef = ref(database, `Houses/${userDetails.houseId}/logs`);
    // Attach an event listener to listen for changes
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        setLogKeys(keys.reverse()); // Reverse to start from the latest log
        updateLogs(keys, 0); // Fetch logs again with the new keys
      }
    });

    // Cleanup function to unsubscribe from the event listener
    return () => unsubscribe();
  }, []);

  const updateLogs = (keys, startIndex) => {
    const sliceKeys = keys.slice(startIndex, startIndex + 10); // Get a slice of keys for the current page
    const promises = sliceKeys.map((key) =>
      get(
        ref(
          database,
          `Houses/${
            JSON.parse(localStorage.getItem("UserDetails")).houseId
          }/logs/${key}`
        )
      )
    );

    Promise.all(promises).then((snapshots) => {
      const newLogs = snapshots.map((snapshot) => snapshot.val());
      setLogs(newLogs);
    });
  };

  const handlePrevious = () => {
    if (pageIndex > 0) {
      const newIndex = pageIndex - 10;
      setPageIndex(newIndex);
      updateLogs(logKeys, newIndex);
    }
  };

  const handleNext = () => {
    if (pageIndex + 10 < logKeys.length) {
      const newIndex = pageIndex + 10;
      setPageIndex(newIndex);
      updateLogs(logKeys, newIndex);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Logs</h2>
      <ul className="list-group">
        {logs.map((log, index) => (
          <li key={index} className="list-group-item">
            {log}
          </li>
        ))}
      </ul>
      <div className="mt-3 d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={pageIndex === 0}
        >
          Previous 10 Messages
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
          disabled={pageIndex + 10 >= logKeys.length}
        >
          Next 10 Messages
        </button>
      </div>
    </div>
  );
}
