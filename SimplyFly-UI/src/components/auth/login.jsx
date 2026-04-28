import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  //const [token, setToken] = useState(undefined);
  const [successMsg, setSuccessMsg] = useState(undefined);
  const [errMsg, setErrMsg] = useState(undefined);
  const loginAPI = "http://localhost:8080/api/auth/login";
  const userDetailsApi = "http://localhost:8080/api/auth/userdetails";
  const navigate = useNavigate();

  const processLogin = async (e) => {
    e.preventDefault();
    console.log(username + " " + password);
    const encodedString = window.btoa(username + ":" + password);
    console.log(encodedString);

    const config = {
      headers: {
        Authorization: "Basic " + encodedString,
      },
    };

    try {
      const response = await axios.get(loginAPI, config);
      console.log(response);

      localStorage.setItem("token", response.data.token);

      const detailsHeader = {
        headers: {
          Authorization: "Bearer " + response.data.token,
        },
      };

      const apiResponse = await axios.get(userDetailsApi, detailsHeader);
      console.log(apiResponse.data.username + " " + apiResponse.data.role);

      switch (apiResponse.data.role) {
        case "PASSENGER":
          navigate("/search-flights");
          break;

        case "ADMIN":
          navigate("/admin-dashboard");
          break;

        case "FLIGHT_OWNER":
          navigate("/owner/dashboard");
          break;
      }

      setSuccessMsg("Login Successful !!");
      setErrMsg(undefined);
    } catch (err) {
      //console.log(err.response)
      if (err.response.data.message === "Account Deactivated")
        setErrMsg("Account deactivated by Admin !!");
      else setErrMsg("Invalid Credentials");
      setSuccessMsg(undefined);
    }
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-lg-12"></div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              {errMsg == undefined ? (
                ""
              ) : (
                <div className="alert alert-danger mt-4">{errMsg} </div>
              )}

              {successMsg == undefined ? (
                ""
              ) : (
                <div className="alert alert-success mt-4">{successMsg} </div>
              )}

              <form onSubmit={(e) => processLogin(e)}>
                <div className="mt-2">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    required="required"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <input type="submit" className="btn btn-secondary" />
                </div>
              </form>
            </div>
            <div className="card-footer">
              Don't have an Account ? &nbsp;
              <Link to="/signup">Signup</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
    </div>
  );
}

export default Login;
