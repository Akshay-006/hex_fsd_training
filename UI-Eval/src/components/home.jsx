import { Link } from "react-router-dom";
import Navbar from "./navbar";

function Home() {
  //git commit ref added to highlight main components
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <Navbar />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div>Welcome to User Management</div>
              <div>
                <Link to="/user-list">See users</Link>
              </div>
              <div>
                <Link to="/user-list">Add user</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
    </div>
  );
}
export default Home;
