import { Link, useNavigate } from "react-router-dom";
import "./search-flights/search-flights";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../redux/actions/userAction";
import { useEffect } from "react";
function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <nav className="sf-navbar">
      <Link className="sf-navbar__logo" to="/">
        Simply<span>Fly</span>
      </Link>
      <Link
        className="sf-navbar__link sf-navbar__link--active"
        to="/search-flights"
      >
        Search
      </Link>

      <Link className="sf-navbar__link " to="/bookings">
        My bookings
      </Link>

      {/* <Link className="sf-navbar__link" to="/baggage">
        Baggage info
      </Link> */}
      {/* <Link className="sf-navbar__link" to="/help">
        Help
      </Link> */}
      <div className="sf-navbar__right">
        {/* Replace "John D." with logged-in user's name from your auth context */}
        <span className="sf-navbar__username">{details.username}</span>
        {/* Replace "JD" with initials derived from the logged-in user's name */}
        <div className="sf-navbar__avatar">{details.username}</div>
        <button
          className="btn btn-outline-danger"
          type="submit"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
