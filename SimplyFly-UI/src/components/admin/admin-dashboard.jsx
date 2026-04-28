import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/userAction";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
const token = () => localStorage.getItem("token");
const authHdr = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  const items = [
    { key: "dashboard", label: "Dashboard", dot: "#60A5FA" },
    { key: "airports", label: "Airports", dot: "#34D399" },
    { key: "routes", label: "Routes", dot: "#60A5FA" },
    { key: "flights", label: "Flights", dot: "#60A5FA" },
    { key: "users", label: "Users", dot: "#A78BFA" },
    { key: "cancellations", label: "Cancellations", dot: "#F87171" },
  ];
  return (
    <div className="ad-sidebar">
      <div className="ad-sidebar__logo">
        Simply<span>Fly</span>
      </div>
      <div className="ad-sidebar__role">Admin</div>
      <div className="ad-sidebar__section">Management</div>
      {items.map((item) => (
        <div
          key={item.key}
          className={`ad-nav-item${active === item.key ? " ad-nav-item--active" : ""}`}
          onClick={() => setActive(item.key)}
        >
          <div className="ad-nav-item__dot" style={{ background: item.dot }} />
          {item.label}
        </div>
      ))}
      <div className="ad-sidebar__bottom">
        <div className="ad-sidebar__user">
          <div className="ad-sidebar__avatar">
            {details.username.substring(0, 1).toUpperCase()}
          </div>
          <div className="ad-sidebar__username">
            {details.username.toUpperCase()}
          </div>
        </div>
        <button
          className="ad-sidebar__logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          ← Sign out
        </button>
      </div>
    </div>
  );
}

// ── Metrics ───────────────────────────────────────────────────────────────────

function Metrics() {
  const [stats, setStats] = useState({});
  const api = "http://localhost:8080/api/admin/dashboard/stats";

  useEffect(() => {
    const getStats = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const response = await axios.get(api, config);
      //console.log(response);
      setStats(response.data);
    };
    getStats();
  }, []);

  //console.log(stats.totalAirports);

  const cards = [
    { label: "Airports", val: stats.totalAirports, color: "#15803D" },
    { label: "Routes", val: stats.totalRoutes, color: "#185FA5" },
    { label: "Flights", val: stats.totalFlights, color: "#7C3AED" },
    { label: "Users", val: stats.totalUsers, color: "#111827" },
    { label: "Cancellations", val: stats.totalCancellations, color: "#DC2626" },
  ];
  return (
    <div className="ad-metrics">
      {cards.map((c) => (
        <div key={c.label} className="ad-metric">
          <div className="ad-metric__label">{c.label}</div>
          <div className="ad-metric__val" style={{ color: c.color }}>
            {c.val}
          </div>
          <div className="ad-metric__sub">Total in system</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 1 — AIRPORTS
// ─────────────────────────────────────────────────────────────────────────────

function AirportModal({ airport, onClose, onSave, loading }) {
  const [city, setCity] = useState(airport?.city || "");
  const [name, setName] = useState(airport?.name || "");
  const [code, setCode] = useState(airport?.code || "");

  const handleSubmit = () => {
    if (!city.trim() || !name.trim() || !code.trim()) {
      alert("All fields required");
      return;
    }
    if (code.length !== 3) {
      alert("Airport code must be 3 characters");
      return;
    }
    onSave({ city, name, code: code.toUpperCase() });
  };

  return (
    <div className="ad-overlay">
      <div className="ad-modal">
        <div className="ad-modal__title">
          {airport ? "Edit airport" : "Add airport"}
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">City</div>
          <input
            className="ad-form-input"
            placeholder="e.g. Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">Airport name</div>
          <input
            className="ad-form-input"
            placeholder="e.g. Chennai Intl. Airport"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">IATA code</div>
          <input
            className="ad-form-input"
            placeholder="e.g. MAA"
            maxLength={3}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>
        <div className="ad-modal__actions">
          <button className="ad-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ad-modal__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : airport ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AirportsTab() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(0);
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", airport? }
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const getApi = "http://localhost:8080/api/airport/get-all";
  const postApi = "http://localhost:8080/api/airport/admin/create";
  const updateApi = "http://localhost:8080/api/airport/admin/update";
  const deleteApi = "http://localhost:8080/api/airport/admin/delete";
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  // REPLACE: GET /api/admin/airports
  useEffect(() => {
    const getAirports = async () => {
      const response = await axios.get(getApi, config);
      setAirports(response.data);
      setLoading(false);
    };
    getAirports();
  }, [refetch]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await axios.post(postApi, data, config);
      } else {
        await axios.put(updateApi + `/${modal.airport.id}`, data, config);
      }
      setModal(null);
      setRefetch((p) => p + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this airport? This cannot be undone.")) return;

    await axios.delete(deleteApi + `/${id}`, config);
    setAirports((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Airports</div>
          <div className="ad-section-sub">
            {airports.length} airports in the system
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="ad-search"
            placeholder="Search city or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="ad-add-btn"
            onClick={() => setModal({ mode: "add" })}
          >
            + Add airport
          </button>
        </div>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>City</th>
                <th>Airport name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#185FA5",
                        fontSize: 14,
                      }}
                    >
                      {a.code}
                    </span>
                  </td>
                  <td>
                    <div className="ad-table__primary">{a.city}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {a.name}
                    </div>
                  </td>
                  <td>
                    <div className="ad-action-wrap">
                      <button
                        className="ad-btn ad-btn--edit"
                        onClick={() => setModal({ mode: "edit", airport: a })}
                      >
                        Edit
                      </button>
                      <button
                        className="ad-btn ad-btn--delete"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <AirportModal
          airport={modal.airport}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saving}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 2 — ROUTES
// ─────────────────────────────────────────────────────────────────────────────

function RouteModal({ route, airports, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    sourceAirportId: route
      ? airports.find((a) => a.code === route.fromCode)?.id || ""
      : "",
    destinationAirportId: route
      ? airports.find((a) => a.code === route.toCode)?.id || ""
      : "",
    departureDate: route ? route.departureDate.slice(0, 16) : "",
    arrivalDate: route ? route.arrivalDate.slice(0, 16) : "",
    departureTime: route?.departureTime || "MORNING",
    durationHours: route?.durationHours || "",
    durationMins: route?.durationMins || "",
    stops: route?.stops || "Non-stop",
    tripType: route?.tripType || "ONE_WAY",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (
      !form.sourceAirportId ||
      !form.destinationAirportId ||
      !form.departureDate ||
      !form.arrivalDate
    ) {
      alert("Please fill all required fields");
      return;
    }
    if (form.sourceAirportId === form.destinationAirportId) {
      alert("Source and destination cannot be the same");
      return;
    }
    onSave({
      ...form,
      departureDate: form.departureDate + ":00",
      arrivalDate: form.arrivalDate + ":00",
      durationHours: Number(form.durationHours),
      durationMins: Number(form.durationMins),
    });
  };

  return (
    <div className="ad-overlay">
      <div className="ad-modal">
        <div className="ad-modal__title">
          {route ? "Edit route" : "Create route"}
        </div>
        <div className="ad-form-row">
          <div className="ad-form-field">
            <div className="ad-form-label">Source airport</div>
            <select
              className="ad-form-select"
              value={form.sourceAirportId}
              onChange={(e) => set("sourceAirportId", e.target.value)}
            >
              <option value="">Select airport</option>
              {airports.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>
          <div className="ad-form-field">
            <div className="ad-form-label">Destination airport</div>
            <select
              className="ad-form-select"
              value={form.destinationAirportId}
              onChange={(e) => set("destinationAirportId", e.target.value)}
            >
              <option value="">Select airport</option>
              {airports.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="ad-form-row">
          <div className="ad-form-field">
            <div className="ad-form-label">Departure date & time</div>
            <input
              type="datetime-local"
              className="ad-form-input"
              value={form.departureDate}
              onChange={(e) => set("departureDate", e.target.value)}
            />
          </div>
          <div className="ad-form-field">
            <div className="ad-form-label">Arrival date & time</div>
            <input
              type="datetime-local"
              className="ad-form-input"
              value={form.arrivalDate}
              onChange={(e) => set("arrivalDate", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-form-row">
          <div className="ad-form-field">
            <div className="ad-form-label">Duration (hours)</div>
            <input
              type="number"
              className="ad-form-input"
              min={0}
              value={form.durationHours}
              onChange={(e) => set("durationHours", e.target.value)}
            />
          </div>
          <div className="ad-form-field">
            <div className="ad-form-label">Duration (mins)</div>
            <input
              type="number"
              className="ad-form-input"
              min={0}
              max={59}
              value={form.durationMins}
              onChange={(e) => set("durationMins", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-form-row">
          <div className="ad-form-field">
            <div className="ad-form-label">Departure time</div>
            <select
              className="ad-form-select"
              value={form.departureTime}
              onChange={(e) => set("departureTime", e.target.value)}
            >
              {["MORNING", "AFTERNOON", "EVENING", "NIGHT"].map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="ad-form-field">
            <div className="ad-form-label">Trip type</div>
            <select
              className="ad-form-select"
              value={form.tripType}
              onChange={(e) => set("tripType", e.target.value)}
            >
              {["ONE_WAY", "ROUND_TRIP", "MULTI_CITY"].map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">Stops</div>
          <input
            className="ad-form-input"
            placeholder="e.g. Non-stop or 1 stop · HYD"
            value={form.stops}
            onChange={(e) => set("stops", e.target.value)}
          />
        </div>
        <div className="ad-modal__actions">
          <button className="ad-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ad-modal__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : route ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoutesTab() {
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(0);
  const [modal, setModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [saving, setSaving] = useState(false);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const getRouteApi = `http://localhost:8080/api/admin/routes/get-all?page=${currentPage}&size=8`;
  const getAirportsApi = "http://localhost:8080/api/airport/get-all";
  const postApi = "http://localhost:8080/api/admin/routes/create";
  const updateApi = "http://localhost:8080/api/admin/routes/update";
  const deleteApi = "http://localhost:8080/api/admin/routes/delete";

  // REPLACE: GET /api/admin/routes and GET /api/admin/airports
  useEffect(() => {
    const getRoutesAndAirports = async () => {
      const response1 = await axios.get(getRouteApi, config);
      setRoutes(response1.data.data);
      setTotalPages(response1.data.totalPages);
      setTotalElements(response1.data.totalElements);
      const response2 = await axios.get(getAirportsApi, config);
      setAirports(response2.data);
      setLoading(false);
    };
    getRoutesAndAirports();
  }, [refetch, currentPage]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await axios.post(postApi, data, config);
        setRefetch((p) => p + 1);
      } else {
        await axios.put(updateApi + `/${modal.route.id}`, data, config);
        setRefetch((p) => p + 1);
      }
      setModal(null);
      setRefetch((p) => p + 1);
      setCurrentPage(0);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    await axios.delete(deleteApi + `/${id}`, config);

    setRoutes((prev) => prev.filter((r) => r.id !== id));
    setCurrentPage(0);
  };

  return (
    <>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Routes</div>
          <div className="ad-section-sub">
            {routes.length} routes configured
          </div>
        </div>
        <button
          className="ad-add-btn"
          onClick={() => setModal({ mode: "add" })}
        >
          + Create route
        </button>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Stops</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="ad-table__primary">
                      {r.fromCode} → {r.toCode}
                    </div>
                    <div className="ad-table__secondary">
                      {r.fromCity} → {r.toCity}
                    </div>
                  </td>
                  <td>
                    <div className="ad-table__primary">
                      {fmtDate(r.departureDate)}
                    </div>
                    <div className="ad-table__secondary">
                      {fmtTime(r.departureDate)}
                    </div>
                  </td>
                  <td>
                    <div className="ad-table__primary">
                      {fmtDate(r.arrivalDate)}
                    </div>
                    <div className="ad-table__secondary">
                      {fmtTime(r.arrivalDate)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>
                      {r.durationHours}h {r.durationMins}m
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {r.tripType.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {r.stops}
                    </div>
                  </td>
                  <td>
                    <div className="ad-action-wrap">
                      <button
                        className="ad-btn ad-btn--edit"
                        onClick={() => setModal({ mode: "edit", route: r })}
                      >
                        Edit
                      </button>
                      <button
                        className="ad-btn ad-btn--delete"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid #F3F4F6",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            marginTop: -24,
          }}
        >
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            Showing page {currentPage + 1} of {totalPages} · {totalElements}{" "}
            total
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === 0 ? "#D1D5DB" : "#374151",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: currentPage === i ? 700 : 500,
                  border: "1px solid",
                  borderColor: currentPage === i ? "#185FA5" : "#E5E7EB",
                  background: currentPage === i ? "#185FA5" : "#fff",
                  color: currentPage === i ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === totalPages - 1 ? "#D1D5DB" : "#374151",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      {modal && (
        <RouteModal
          route={modal.route}
          airports={airports}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saving}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 3 — FLIGHTS
// ─────────────────────────────────────────────────────────────────────────────

function FlightModal({ flight, routes, owners, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    flightNumber: flight?.flightNumber || "",
    name: flight?.name || "",
    routeId: flight
      ? routes.find((r) => r.fromCode === flight.fromCode)?.id || ""
      : "",
    ownerId: flight
      ? owners.find((u) => u.username === flight.ownerUsername)?.userId || ""
      : "",
    seatRows: flight?.seatRows || 7,
    seatColumns: flight?.seatColumns || 6,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.flightNumber || !form.routeId || !form.ownerId) {
      alert("Fill all required fields");
      return;
    }
    onSave({
      ...form,
      seatRows: Number(form.seatRows),
      seatColumns: Number(form.seatColumns),
      routeId: Number(form.routeId),
      ownerId: Number(form.ownerId),
    });
  };

  return (
    <div className="ad-overlay">
      <div className="ad-modal">
        <div className="ad-modal__title">
          {flight ? "Edit flight" : "Create flight"}
        </div>
        <div className="ad-form-row">
          <div className="ad-form-field">
            <div className="ad-form-label">Flight number</div>
            <input
              className="ad-form-input"
              placeholder="e.g. 6E 234"
              value={form.flightNumber}
              onChange={(e) => set("flightNumber", e.target.value)}
            />
          </div>
          <div className="ad-form-field">
            <div className="ad-form-label">Airline name</div>
            <input
              className="ad-form-input"
              placeholder="e.g. IndiGo"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">Route</div>
          <select
            className="ad-form-select"
            value={form.routeId}
            onChange={(e) => set("routeId", e.target.value)}
          >
            <option value="">Select route</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fromCode} → {r.toCode} · {fmtDate(r.departureDate)}
              </option>
            ))}
          </select>
        </div>
        <div className="ad-form-field">
          <div className="ad-form-label">Flight owner</div>
          <select
            className="ad-form-select"
            value={form.ownerId}
            onChange={(e) => set("ownerId", e.target.value)}
          >
            <option value="">Select owner</option>
            {owners.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
        {!flight && (
          <div className="ad-form-row">
            <div className="ad-form-field">
              <div className="ad-form-label">Seat rows</div>
              <input
                type="number"
                className="ad-form-input"
                min={1}
                value={form.seatRows}
                onChange={(e) => set("seatRows", e.target.value)}
              />
            </div>
            <div className="ad-form-field">
              <div className="ad-form-label">Seat columns</div>
              <input
                type="number"
                className="ad-form-input"
                min={1}
                max={6}
                value={form.seatColumns}
                onChange={(e) => set("seatColumns", e.target.value)}
              />
            </div>
          </div>
        )}
        {!flight && (
          <div
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: -8,
              marginBottom: 14,
            }}
          >
            Total seats: {Number(form.seatRows) * Number(form.seatColumns)} ·
            Seats auto-generated on create
          </div>
        )}
        <div className="ad-modal__actions">
          <button className="ad-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ad-modal__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : flight
                ? "Update"
                : "Create & generate seats"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FlightsTab() {
  const [flights, setFlights] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(0);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const getFlightsApi = `http://localhost:8080/api/admin/flights/get-all?page=${currentPage}&size=8`;
  const getRoutesApi = "http://localhost:8080/api/admin/routes/get-all";
  const getUsersApi = "http://localhost:8080/api/admin/users/role/FLIGHT_OWNER";
  const postApi = "http://localhost:8080/api/admin/flights/create";
  const updateApi = "http://localhost:8080/api/admin/flights/update";
  const deleteApi = "http://localhost:8080/api/admin/flights/delete";

  // REPLACE: GET /api/admin/flights, /api/admin/routes, /api/admin/users/role/FLIGHT_OWNER
  useEffect(() => {
    const get = async () => {
      const response1 = await axios.get(getFlightsApi, config);
      setFlights(response1.data.data);
      setTotalPages(response1.data.totalPages);
      setTotalElements(response1.data.totalElements);
      const response2 = await axios.get(getRoutesApi, config);
      setRoutes(response2.data.data);
      const response3 = await axios.get(getUsersApi, config);
      setOwners(response3.data.data);
      setLoading(false);
    };
    get();
  }, [refetch, currentPage]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (modal.mode === "add") {
        // await fetch("/api/admin/flights", { method: "POST", headers: authHdr(), body: JSON.stringify(data) });
        await axios.post(postApi, data, config);
      } else {
        // await fetch(`/api/admin/flights/${modal.flight.flightId}`, { method: "PUT", headers: authHdr(), body: JSON.stringify(data) });
        await axios.put(updateApi + `/${modal.flight.flightId}`, data, config);
      }
      setModal(null);
      setRefetch((p) => p + 1);
      setCurrentPage(0);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight and all its seats?")) return;
    // await fetch(`/api/admin/flights/${id}`, { method: "DELETE", headers: authHdr() });
    await axios.delete(deleteApi + `/${id}`, config);
    // setFlights((prev) => prev.filter((f) => f.flightId !== id));
    setRefetch((p) => p + 1);
    setCurrentPage(0);
  };

  return (
    <>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Flights</div>
          <div className="ad-section-sub">
            {flights.length} flights registered
          </div>
        </div>
        <button
          className="ad-add-btn"
          onClick={() => setModal({ mode: "add" })}
        >
          + Create flight
        </button>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Seats</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.flightId}>
                  <td>
                    <div className="ad-table__primary">{f.flightNumber}</div>
                    <div className="ad-table__secondary">{f.name}</div>
                  </td>
                  <td>
                    <div className="ad-table__primary">
                      {f.fromCode} → {f.toCode}
                    </div>
                  </td>
                  <td>
                    {f.departureDate !== null ? (
                      <div>
                        <div className="ad-table__primary">
                          {fmtDate(f.departureDate)}
                        </div>
                        <div className="ad-table__secondary">
                          {fmtTime(f.departureDate)}
                        </div>
                      </div>
                    ) : (
                      <div>Not assigned</div>
                    )}
                  </td>
                  <td>
                    <div className="ad-table__primary">{f.availableSeats}</div>
                    <div className="ad-table__secondary">
                      {f.seatRows} rows × {f.seatColumns} cols
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#7C3AED",
                        fontWeight: 600,
                      }}
                    >
                      {f.ownerUsername || "—"}
                    </div>
                  </td>
                  <td>
                    <div className="ad-action-wrap">
                      <button
                        className="ad-btn ad-btn--edit"
                        onClick={() => setModal({ mode: "edit", flight: f })}
                      >
                        Edit
                      </button>
                      <button
                        className="ad-btn ad-btn--delete"
                        onClick={() => handleDelete(f.flightId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid #F3F4F6",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            marginTop: -24,
          }}
        >
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            Showing page {currentPage + 1} of {totalPages} · {totalElements}{" "}
            total
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === 0 ? "#D1D5DB" : "#374151",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: currentPage === i ? 700 : 500,
                  border: "1px solid",
                  borderColor: currentPage === i ? "#185FA5" : "#E5E7EB",
                  background: currentPage === i ? "#185FA5" : "#fff",
                  color: currentPage === i ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === totalPages - 1 ? "#D1D5DB" : "#374151",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      {modal && (
        <FlightModal
          flight={modal.flight}
          routes={routes}
          owners={owners}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saving}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 4 — USERS
// ─────────────────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const usersApi = `http://localhost:8080/api/admin/users/get-all?page=${currentPage}&size=8`;
  const toggleApi = "http://localhost:8080/api/admin/users/toggle";

  // REPLACE: GET /api/admin/users
  useEffect(() => {
    // setTimeout(() => {
    //   setUsers(HC_USERS);
    //   setLoading(false);
    // }, 400);
    const getUsers = async () => {
      const response = await axios.get(usersApi, config);
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    };
    getUsers();
  }, [currentPage]);

  const handleToggle = async (userId) => {
    // await fetch(`/api/admin/users/${userId}/toggle`, { method: "PATCH", headers: authHdr() });
    await axios.put(toggleApi + `/${userId}`, {}, config);
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId ? { ...u, isActive: !u.isActive } : u,
      ),
    );
  };

  const ROLES = ["ALL", "ADMIN", "FLIGHT_OWNER", "PASSENGER"];

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleBadge = (role) => {
    const map = {
      ADMIN: "admin",
      FLIGHT_OWNER: "owner",
      PASSENGER: "passenger",
    };
    return map[role] || "passenger";
  };

  return (
    <>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Users</div>
          <div className="ad-section-sub">{users.length} registered users</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            className="ad-search"
            placeholder="Search username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />
          <div className="ad-filter-pills">
            {ROLES.map((r) => (
              <button
                key={r}
                className={`ad-pill${roleFilter === r ? " ad-pill--active" : ""}`}
                onClick={() => {
                  setRoleFilter(r);
                  setCurrentPage(0);
                }}
              >
                {r === "ALL"
                  ? "All"
                  : r === "FLIGHT_OWNER"
                    ? "Owner"
                    : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId}>
                  <td>
                    <div className="ad-table__primary">{u.username}</div>
                    <div className="ad-table__secondary">ID #{u.userId}</div>
                  </td>
                  <td>
                    <span className={`ad-badge ad-badge--${roleBadge(u.role)}`}>
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`ad-badge ${u.isActive ? "ad-badge--active" : "ad-badge--inactive"}`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="ad-table__secondary">
                      {fmtDate(u.createdAt)}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`ad-btn ${u.isActive ? "ad-btn--delete" : "ad-btn--success"}`}
                      onClick={() => handleToggle(u.userId)}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid #F3F4F6",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            marginTop: -24,
          }}
        >
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            Showing page {currentPage + 1} of {totalPages} · {totalElements}{" "}
            total
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === 0 ? "#D1D5DB" : "#374151",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: currentPage === i ? 700 : 500,
                  border: "1px solid",
                  borderColor: currentPage === i ? "#185FA5" : "#E5E7EB",
                  background: currentPage === i ? "#185FA5" : "#fff",
                  color: currentPage === i ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === totalPages - 1 ? "#D1D5DB" : "#374151",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 5 — CANCELLATIONS (system-wide, view only)
// ─────────────────────────────────────────────────────────────────────────────

function CancellationsTab() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const getApi = `http://localhost:8080/api/admin/cancellations/get-all?page=${currentPage}&size=8`;

  // REPLACE: GET /api/admin/cancellations
  useEffect(() => {
    const getCancel = async () => {
      const response = await axios.get(getApi, config);
      setCancellations(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    };
    getCancel();
  }, [currentPage]);

  const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

  const filtered = cancellations.filter((c) =>
    filter === "ALL" ? true : c.status === filter,
  );

  return (
    <>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Cancellations — system wide</div>
          <div className="ad-section-sub">
            Overview of all cancellations across all flight owners
          </div>
        </div>
        <div className="ad-filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`ad-pill${filter === f ? " ad-pill--active" : ""}`}
              onClick={() => {
                setFilter(f);
                setCurrentPage(0);
              }}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Flight</th>
                <th>Seat</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Requested</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.cancellationId}>
                  <td>
                    <div className="ad-table__primary">{c.passengerName}</div>
                    <div className="ad-table__secondary">
                      ID #{c.flightPassengerId}
                    </div>
                  </td>
                  <td>
                    <div className="ad-table__primary">{c.flightNumber}</div>
                    <div className="ad-table__secondary">
                      {c.fromCode} → {c.toCode} · {fmtDate(c.departureDate)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>
                      Row {c.seatRow}, Col {c.seatColumn}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#185FA5",
                      }}
                    >
                      ₹ {Number(c.totalAmount).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.reason || "—"}
                    </div>
                  </td>
                  <td>
                    <div className="ad-table__secondary">
                      {fmtDate(c.requestedAt)}
                    </div>
                  </td>
                  <td>
                    <span className={`ad-badge ad-badge--${c.status}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid #F3F4F6",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            marginTop: -24,
          }}
        >
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            Showing page {currentPage + 1} of {totalPages} · {totalElements}{" "}
            total
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === 0 ? "#D1D5DB" : "#374151",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: currentPage === i ? 700 : 500,
                  border: "1px solid",
                  borderColor: currentPage === i ? "#185FA5" : "#E5E7EB",
                  background: currentPage === i ? "#185FA5" : "#fff",
                  color: currentPage === i ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #E5E7EB",
                background: "#fff",
                color: currentPage === totalPages - 1 ? "#D1D5DB" : "#374151",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────

function DashboardTab({ setActive, cancellations }) {
  return (
    <>
      <Metrics />
      <div className="ad-section-header">
        <div className="ad-section-title">Recent cancellations</div>
        <button
          style={{
            fontSize: 13,
            color: "#185FA5",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
          onClick={() => setActive("cancellations")}
        >
          View all →
        </button>
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Flight</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cancellations.slice(0, 5).map((c) => (
              <tr key={c.cancellationId}>
                <td>
                  <div className="ad-table__primary">{c.passengerName}</div>
                </td>
                <td>
                  <div className="ad-table__primary">
                    {c.flightNumber} · {c.fromCode} → {c.toCode}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "#185FA5" }}>
                    ₹ {Number(c.totalAmount).toLocaleString("en-IN")}
                  </div>
                </td>
                <td>
                  <span className={`ad-badge ad-badge--${c.status}`}>
                    {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [cancellations, setCancellations] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const getApi = "http://localhost:8080/api/admin/cancellations/get-all";

  // REPLACE: GET /api/admin/cancellations
  useEffect(() => {
    const getCancel = async () => {
      const response = await axios.get(getApi, config);
      setCancellations(response.data.data);
    };
    getCancel();
  }, []);

  const titles = {
    dashboard: "Dashboard",
    airports: "Airport management",
    routes: "Route management",
    flights: "Flight management",
    users: "User management",
    cancellations: "Cancellations — system wide",
  };

  return (
    <div className="ad-page">
      <Sidebar active={active} setActive={setActive} />
      <div className="ad-main">
        <div className="ad-topbar">
          <div className="ad-topbar__title">{titles[active]}</div>
          <div className="ad-topbar__date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="ad-content">
          {active === "dashboard" && (
            <DashboardTab setActive={setActive} cancellations={cancellations} />
          )}
          {active === "airports" && <AirportsTab />}
          {active === "routes" && <RoutesTab />}
          {active === "flights" && <FlightsTab />}
          {active === "users" && <UsersTab />}
          {active === "cancellations" && <CancellationsTab />}
        </div>
      </div>
    </div>
  );
}
