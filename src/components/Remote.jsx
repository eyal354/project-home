import { useState, useEffect } from "react";
import { database } from "../Firebase.js";
import { ref, set, onValue } from "firebase/database";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons are included

function Remote() {
  const [lightLevel, setLightLevel] = useState(false);
  const [temperature, setTemperature] = useState(20); // Starting default temperature

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;
    if (houseId) {
      const lightLevelRef = ref(
        database,
        `Houses/${houseId}/ControlSettings/lightLevel`
      );
      const temperatureRef = ref(
        database,
        `Houses/${houseId}/ControlSettings/temperature`
      );

      // Listen to the light level changes
      const lightLevelListener = onValue(lightLevelRef, (snapshot) => {
        const lightLevelValue = snapshot.val();
        setLightLevel(lightLevelValue === 100);
      });

      // Listen to the temperature changes
      const temperatureListener = onValue(temperatureRef, (snapshot) => {
        const tempValue = snapshot.val();
        setTemperature(tempValue || 20); // Default to 20 if null or undefined
      });

      return () => {
        lightLevelListener(); // Detach the listener for light level changes
        temperatureListener(); // Detach the listener for temperature changes
      };
    }
  }, []);

  const handleLightLevelChange = () => {
    const newVal = !lightLevel ? 100 : 1;
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;
    const lightLevelRef = ref(
      database,
      `Houses/${houseId}/ControlSettings/lightLevel`
    );
    set(lightLevelRef, newVal);
  };

  const handleTemperatureChange = (newTemperature) => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    const houseId = userDetails?.houseId;
    const temperatureRef = ref(
      database,
      `Houses/${houseId}/ControlSettings/temperature`
    );
    set(temperatureRef, newTemperature);
  };

  return (
    <div>
      <h2>Remote Control</h2>
      <div className="mb-3">
        <label className="form-check-label">Light Level:</label>
        <div className="form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="lightSwitch"
            checked={lightLevel}
            onChange={handleLightLevelChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <label>Temperature: {temperature}°C</label>
        <div
          className="btn-group"
          role="group"
          aria-label="Temperature controls"
        >
          <button
            className="btn btn-secondary mx-1"
            onClick={() =>
              handleTemperatureChange(Math.max(15, temperature - 1))
            }
            disabled={temperature <= 15}
          >
            <i className="bi bi-arrow-down"></i>
          </button>
          <button
            className="btn btn-secondary mx-1"
            onClick={() =>
              handleTemperatureChange(Math.min(30, temperature + 1))
            }
            disabled={temperature >= 30}
          >
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Remote;
