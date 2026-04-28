import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar";

function PassengerSignup() {
  const [name, setName] = useState(undefined);
  const [gender, setGender] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [address, setAdress] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [contact, setContact] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);

  const [successMsg, setSuccessMsg] = useState(undefined);
  const [errMsg, setErrMsg] = useState(undefined);

  const signupApi = "http://localhost:8080/api/auth/passenger/signup";

  const processSignup = async (e) => {
    e.preventDefault();
    console.log(
      name + gender + email + address + age + contact + username + password,
    );
    const body = {
      username: username,
      password: password,
      name: name,
      gender: gender,
      age: age,
      contact: contact,
      email: email,
      address: address,
    };
    try {
      await axios.post(signupApi, body);
      setSuccessMsg("Signup successful !!");
      setErrMsg(undefined);
    } catch (err) {
      if (err.response.data.message === "Username already Exists !!")
        setErrMsg("Username already Exists !!");
      else setErrMsg("Signup failed ");
      setSuccessMsg(undefined);
    }
  };

  return (
    <div className="container">
      <div className="row ">
        <div className="col-lg-12"></div>
      </div>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Sign Up as a Passenger</div>
            <div className="card-body">
              <form onSubmit={(e) => processSignup(e)}>
                {errMsg == undefined ? (
                  ""
                ) : (
                  <div className="alert alert-danger">{errMsg}</div>
                )}
                {successMsg == undefined ? (
                  ""
                ) : (
                  <div className="alert alert-success">{successMsg}</div>
                )}
                <div className="mt-4">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="form-label">Gender</label>
                  &nbsp;
                  <select
                    value={gender}
                    className="form-select"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option selected>Open this select menu</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    required="required"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required="required"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setAdress(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <input type="submit" className="btn btn-primary" />
                </div>
              </form>
            </div>
            <div className="card-footer">
              Already Have an Account ? &nbsp;
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
    </div>
  );
}
export default PassengerSignup;
