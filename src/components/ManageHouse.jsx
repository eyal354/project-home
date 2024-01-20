import House from "./House";
import PendingRequests from "./PendingRequests";
import UserList from "./UserList";
import "../component-css/ManageHouse.css";
export default function ManageHouse() {
  return (
    <>
      <h2>Manage House</h2>
      <div className="Manage-panel">
        <House className="Manage-panel-obj" />
        <PendingRequests />
        <UserList />
      </div>
    </>
  );
}
