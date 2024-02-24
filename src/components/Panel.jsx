// import "../component-css/Panel.css";
import UserID from "./UserID.jsx";
import House from "./House.jsx";

function Panel() {
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
