import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Stats() {
  const [stats, setStats] = useState([]);
  const api = "http://localhost:8080/api/booking/stats";

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    const getStats = async () => {
      const response = await axios.get(api, config);
      setStats(response.data);
    };

    getStats();
  }, []);

  console.log(stats);

  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          {stats.map((stat, index) => (
            <div className="col-sm-4" key={index}>
              <Link
                to={`/passenger-dashboard/status/${stat.status.split(" ")[1]}`}
              >
                <div className="card">
                  <div className="card-header">{stat.status}</div>
                  <div className="card-body">{stat.count}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Stats;
