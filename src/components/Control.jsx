// Imports necessary React hooks, Firebase database operations, and context from other modules
import { useState, useEffect } from "react";
import { database } from "../Firebase.js";
import { ref, set, onValue } from "firebase/database";

// Defines the Control component
export default function Control() {
  // useState hooks to manage local state for control settings
  const [securityMode, setSecurityMode] = useState(false);
  const [manualSettings, setManualSettings] = useState(false);

  // useEffect hook to fetch control settings data from Firebase when the component mounts
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;

    if (houseId) {
      const controlSettingsRef = ref(
        database,
        `Houses/${houseId}/ControlSettings`
      );
      onValue(controlSettingsRef, (snapshot) => {
        const settings = snapshot.val() || {};
        setSecurityMode(settings.securityMode || false);
        setManualSettings(settings.manualSettings || false);
      });
    }
  }, []);

  // Function to update control settings in the Firebase database
  const updateControlSetting = (setting, value) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;

    if (houseId) {
      const settingRef = ref(
        database,
        `Houses/${houseId}/ControlSettings/${setting}`
      );
      set(settingRef, value);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Control Settings</h2>
      </div>
      <div className="card-body">
        <div className="form-check form-switch">
          <input
            className="form-check-input" // Bootstrap switch class
            type="checkbox"
            id="securityModeSwitch"
            checked={securityMode}
            onChange={() => {
              updateControlSetting("securityMode", !securityMode);
              setSecurityMode(!securityMode);
            }}
          />
          <label className="form-check-label" htmlFor="securityModeSwitch">
            Security Mode
          </label>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input" // Bootstrap switch class
            type="checkbox"
            id="manualSettingsSwitch"
            checked={manualSettings}
            onChange={() => {
              updateControlSetting("manualSettings", !manualSettings);
              setManualSettings(!manualSettings);
            }}
          />
          <label className="form-check-label" htmlFor="manualSettingsSwitch">
            Manual Settings
          </label>
        </div>
      </div>
    </div>
  );
}
