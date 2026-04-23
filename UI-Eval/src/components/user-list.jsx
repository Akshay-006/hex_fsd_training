import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./navbar";

function UserList() {
  const [users, setUsers] = useState([]);
  const api = "https://jsonplaceholder.typicode.com/users";

  //git commit ref added to highlight main components

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get(api);
      setUsers(response.data);
    };
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    await axios.delete(api + `/${id}`);

    setUsers((users) => users.filter((u) => u.id != id));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <Navbar />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Users</h3>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Action button</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <th scope="row">{user.id}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.company.name}</td>
                      <td>
                        <button
                          className="btn"
                          style={{ color: "red" }}
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
}

export default UserList;
