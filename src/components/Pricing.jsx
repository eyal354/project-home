import React from "react";
// Import Bootstrap CSS in the entry file (e.g., index.js or App.js) if not already imported

export default function Pricing() {
  return (
    <div className="container py-5">
      <h2 className="display-4 text-center mb-4">Pricing</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Features</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Smart Thermostat</td>
              <td>WiFi-enabled, programmable, energy-saving</td>
              <td>$250</td>
            </tr>
            <tr>
              <td>Smart Security Camera</td>
              <td>1080p HD, night vision, motion alerts</td>
              <td>$150</td>
            </tr>
            <tr>
              <td>Smart Door Lock</td>
              <td>Keyless entry, remote access, tamper alerts</td>
              <td>$200</td>
            </tr>
            <tr>
              <td>Smart Lighting System</td>
              <td>Dimmable, color-changing, voice-controlled</td>
              <td>$100 per set</td>
            </tr>
            <tr>
              <td>Smart Speaker</td>
              <td>Music streaming, voice assistant, smart home control</td>
              <td>$99</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
