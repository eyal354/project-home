import House from "./House";
import PendingRequests from "./PendingRequests";
import UserList from "./UserList";
// import "../component-css/ManageHouse.css";

export default function ManageHouse() {
  return (
    <>
      <h2 className="display-1 text-center my-4">Manage House</h2>
      <div className="container">
        <div className="row g-3">
          <div className="col-md-4 col-sm-12">
            <House className="Manage-panel-obj" />
          </div>
          <div className="col-md-4 col-sm-12">
            <PendingRequests />
          </div>
          <div className="col-md-4 col-sm-12">
            <UserList />
          </div>
        </div>
      </div>
    </>
  );
}
