import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [phone, setPhone] = useState(undefined);
  const [companyName, setCompanyName] = useState(undefined);
  const api = "https://jsonplaceholder.typicode.com/users";

  const [successMsg, setSuccessMsg] = useState(undefined);
  const [errMsg, setErrMsg] = useState(undefined);

  //git commit ref added to highlight main components

  const navigate = useNavigate();

  const postUser = async (e) => {
    e.preventDefault();

    const body = {
      name: name,
      email: email,
      phone: phone,
      company: {
        name: companyName,
      },
    };
    try {
      const response = await axios.post(api);
      console.log(response);
      setSuccessMsg("User Added successfully !!");
      setErrMsg(undefined);
      navigate("/user-list");
    } catch (err) {
      setErrMsg("User posting failed !!");
      setSuccessMsg(undefined);
    }
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
              <h3>Add User</h3>
            </div>
            <div className="card-body">
              <form className="form-control" onSubmit={(e) => postUser(e)}>
                {successMsg == undefined ? (
                  <div className="alert" style={{ color: "red" }}>
                    {errMsg}
                  </div>
                ) : (
                  <div className="success" style={{ color: "green" }}>
                    {successMsg}
                  </div>
                )}
                <div className="mt-2">
                  <label>Name</label>
                  <input
                    type="text"
                    required="required"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label>Email</label>
                  <input
                    type="email"
                    required="required"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label>Phone</label>
                  <input
                    type="text"
                    required="required"
                    className="form-control"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label>Company name</label>
                  <input
                    type="text"
                    required="required"
                    className="form-control"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
}
export default AddUser;
