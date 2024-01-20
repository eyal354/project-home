import "../component-css/Panel.css";
import UserID from "./UserID.jsx";
import House from "./House.jsx";

function Panel() {
  return (
    <div className="panel">
      <h1>Panel</h1>
      <House />
      <UserID />
    </div>
  );
}

export default Panel;
