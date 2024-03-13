import { useState, useEffect } from "react";
import { database } from "../Firebase";
import { ref, get, onValue } from "firebase/database";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [logKeys, setLogKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const houseId = JSON.parse(localStorage.getItem("UserDetails"))?.houseId;
    if (!houseId) return;

    const logsRef = ref(database, `Houses/${houseId}/logs`);
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const newLogKeys = Object.keys(snapshot.val()).reverse();
        setLogKeys(newLogKeys);
        fetchLogsForPage(newLogKeys, 0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLogsForPage = (keys, startIndex) => {
    const endIndex = startIndex + 10;
    const currentPageKeys = keys.slice(startIndex, endIndex);

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

  const handlePageChange = (direction) => {
    const adjustment = direction === "next" ? 10 : -10;
    const newIndex = pageIndex + adjustment;
    if (newIndex >= 0 && newIndex < logKeys.length) {
      setPageIndex(newIndex);
      fetchLogsForPage(logKeys, newIndex);
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
          onClick={() => handlePageChange("previous")}
          disabled={pageIndex === 0}
        >
          Previous 10 Messages
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange("next")}
          disabled={pageIndex + 10 >= logKeys.length}
        >
          Next 10 Messages
        </button>
      </div>
    </div>
  );
}
