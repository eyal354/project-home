import "../component-css/Pricing.css";
export default function Pricing() {
  return (
    <div className="pricing">
      <h2 className="display-1 text-center my-4">Pricing</h2>

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Features</th>
            <th>Price</th>
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
  );
}
