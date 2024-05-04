// Import necessary hooks from React and Firebase database functions
import { useState, useEffect } from "react";
import { database } from "../Firebase";
import { ref, get, onValue } from "firebase/database";

// Defines the Logs component
export default function Logs() {
  // State hooks for storing logs, their keys, and the current page index
  const [logs, setLogs] = useState([]);
  const [logKeys, setLogKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  // useEffect hook to load logs on component mount
  useEffect(() => {
    // Retrieve the houseId from localStorage to construct the reference path
    const houseId = JSON.parse(localStorage.getItem("UserDetails"))?.houseId;
    if (!houseId) return; // Exit if no houseId found

    // Create a reference to the logs in the Firebase database
    const logsRef = ref(database, `Houses/${houseId}/logs`);
    // onValue listener to fetch log keys and initial page of logs
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        // Reverse the order of keys to display the most recent logs first
        const newLogKeys = Object.keys(snapshot.val()).reverse();
        setLogKeys(newLogKeys);
        // Fetch logs for the first page
        fetchLogsForPage(newLogKeys, 0);
      }
    });

    // Cleanup function to unsubscribe from the realtime updates
    return () => unsubscribe();
  }, []);

  // Function to fetch logs for a specific page
  const fetchLogsForPage = (keys, startIndex) => {
    const endIndex = startIndex + 10; // Defines the range of logs to fetch
    const currentPageKeys = keys.slice(startIndex, endIndex); // Extracts keys for the current page

    // Fetches logs concurrently based on their keys and updates state
    Promise.all(
      currentPageKeys.map((key) =>
        get(
          ref(
            database,
            `Houses/${
              JSON.parse(localStorage.getItem("UserDetails")).houseId
            }/logs/${key}`
          )
        )
      )
    ).then((snapshots) => {
      const newLogs = snapshots.map((snapshot) => snapshot.val());
      setLogs(newLogs);
    });
  };

  // Function to handle page navigation
  const handlePageChange = (direction) => {
    const adjustment = direction === "next" ? 10 : -10; // Calculate index adjustment based on direction
    const newIndex = pageIndex + adjustment; // Compute the new page index
    // Update page index and fetch logs if the new index is valid
    if (newIndex >= 0 && newIndex < logKeys.length) {
      setPageIndex(newIndex);
      fetchLogsForPage(logKeys, newIndex);
    }
  };

  // Renders the log entries and pagination controls
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>Logs</h2>
        </div>

        <ul className="list-group">
          {logs.map((log, index) => (
            <li key={index} className="list-group-item">
              {log} {/* Displays each log entry */}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 d-flex justify-content-between">
        {/* Pagination controls for navigating through log entries */}
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange("previous")}
          disabled={pageIndex === 0} // Disable if on the first page
        >
          Previous 10 Messages
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange("next")}
          disabled={pageIndex + 10 >= logKeys.length} // Disable if on the last page
        >
          Next 10 Messages
        </button>
      </div>
    </>
  );
}
