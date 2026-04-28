import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/flightownerdashboard.css";
import PassengerManagementTab from "./passenger-management";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/userAction";

// ─────────────────────────────────────────────────────────────────────────────
// HARDCODED DATA — replace with API calls as noted in comments
// ─────────────────────────────────────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(iso) {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ activeTab, setActiveTab, pendingCancellations }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  //console.log(details.username);

  // Replace with logged-in owner's username from localStorage
  // const user = JSON.parse(localStorage.getItem("user"));
  const username = details.username.toUpperCase();
  const initials = username.substring(0, 1).toUpperCase();

  const navItems = [
    { key: "dashboard", label: "Dashboard", dot: "#185FA5" },
    { key: "cancellations", label: "Cancellations", dot: "#854F0B" },
    { key: "routes", label: "Route management", dot: "#185FA5" },
    { key: "passengers", label: "Passengers", dot: "#185FA5" },
  ];

  return (
    <div className="fo-sidebar">
      <div className="fo-sidebar__logo">
        Simply<span>Fly</span>
      </div>
      <div className="fo-sidebar__role">Flight Owner</div>

      <div className="fo-sidebar__section">Main</div>
      {navItems.map((item) => (
        <div
          key={item.key}
          className={`fo-nav-item${activeTab === item.key ? " fo-nav-item--active" : ""}`}
          onClick={() => setActiveTab(item.key)}
        >
          <div className="fo-nav-item__dot" style={{ background: item.dot }} />
          {item.label}
          {item.key === "cancellations" && pendingCancellations > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 700,
                background: "#FAEEDA",
                color: "#854F0B",
                padding: "1px 7px",
                borderRadius: 10,
              }}
            >
              {/* Replace with real pending count */}
              {pendingCancellations}
            </span>
          )}
        </div>
      ))}

      <div className="fo-sidebar__bottom">
        <div className="fo-sidebar__user">
          <div className="fo-sidebar__avatar">{initials}</div>
          <div className="fo-sidebar__username">{username}</div>
        </div>
        <button
          className="fo-sidebar__logout"
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

// ── Metric cards ──────────────────────────────────────────────────────────────

function MetricCards({ stats, cancellations }) {
  const [totalBookings, setTotalBookings] = useState(0);
  const [cancelledBookings, setCancelledBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const statsAPI = "http://localhost:8080/api/booking/dashboard/stats";

  useEffect(() => {
    const getStats = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      const response = await axios.get(statsAPI, config);
      setTotalBookings(response.data.totalBookings);
      setCancelledBookings(response.data.cancelledBookings);
      setTotalRevenue(response.data.totalRevenue);
    };
    getStats();
  }, []);

  const pendingCancellations = cancellations.filter(
    (c) => c.status === "PENDING",
  ).length;

  return (
    <div className="fo-metrics">
      <div className="fo-metric">
        <div className="fo-metric__label">Total bookings</div>
        {/* Replace HARDCODED_STATS with GET /api/owner/stats */}
        <div className="fo-metric__val">{totalBookings}</div>
        <div className="fo-metric__sub">Across all flights</div>
      </div>
      <div className="fo-metric fo-metric--pending">
        <div className="fo-metric__label">Pending cancellations</div>
        <div className="fo-metric__val">{pendingCancellations}</div>
        <div className="fo-metric__sub">Needs your review</div>
      </div>
      <div className="fo-metric fo-metric--cancelled">
        <div className="fo-metric__label">Cancelled bookings</div>
        <div className="fo-metric__val">{cancelledBookings}</div>
        <div className="fo-metric__sub">This month</div>
      </div>
      <div className="fo-metric fo-metric--revenue">
        <div className="fo-metric__label">Total revenue</div>
        <div className="fo-metric__val" style={{ fontSize: 18 }}>
          {totalRevenue}
        </div>
        <div className="fo-metric__sub">Confirmed bookings</div>
      </div>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

function ConfirmModal({ action, cancellation, onConfirm, onClose, loading }) {
  const isApprove = action === "approve";
  return (
    <div className="fo-overlay">
      <div className="fo-modal">
        <div className="fo-modal__title">
          {isApprove ? "Approve cancellation?" : "Reject cancellation?"}
        </div>
        <div className="fo-modal__sub">
          {isApprove
            ? "Approving will mark the amount as 'Yet to be refunded' and confirm the cancellation."
            : "Rejecting will revert the booking back to Confirmed status."}
        </div>

        <div className="fo-modal__details">
          <div className="fo-modal__row">
            <span>Passenger</span>
            <span>{cancellation.passengerName}</span>
          </div>
          <div className="fo-modal__row">
            <span>Flight</span>
            <span>
              {cancellation.flightNumber} · {cancellation.fromCode} →{" "}
              {cancellation.toCode}
            </span>
          </div>
          <div className="fo-modal__row">
            <span>Seat</span>
            <span>
              Row {cancellation.seatRow}, Col {cancellation.seatColumn}
            </span>
          </div>
          <div className="fo-modal__row">
            <span>Refund amount</span>
            <span style={{ color: "#185FA5", fontWeight: 700 }}>
              ₹ {Number(cancellation.totalAmount).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="fo-modal__row">
            <span>Reason</span>
            <span>{cancellation.reason || "No reason provided"}</span>
          </div>
        </div>

        <div className="fo-modal__actions">
          <button
            className="fo-modal__cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`fo-modal__confirm-btn fo-modal__confirm-btn--${action}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isApprove
                ? "Approve & refund"
                : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cancellations tab ─────────────────────────────────────────────────────────

function CancellationsTab({ cancellations, loading, refetch }) {
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("PENDING");
  const [modal, setModal] = useState(null); // { action, cancellation }
  const [actionLoading, setActionLoading] = useState(false);

  // ── Approve ────────────────────────────────────────────────────────────────
  // REPLACE with: PATCH /api/owner/cancellations/{id}/approve
  const handleApprove = async () => {
    setActionLoading(true);
    const { cancellation } = modal;
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await axios.put(
        `http://localhost:8080/api/cancellations/owner/${cancellation.cancellationId}/approve`,
        {},
        config,
      );
      setModal(null);
      refetch();
    } catch (err) {
      alert("Failed to approve: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────────
  // REPLACE with: PATCH /api/owner/cancellations/{id}/reject
  const handleReject = async () => {
    setActionLoading(true);
    const { cancellation } = modal;
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await axios.put(
        `http://localhost:8080/api/cancellations/owner/${cancellation.cancellationId}/reject`,
        {},
        config,
      );
      setModal(null);
      refetch();
    } catch (err) {
      alert("Failed to reject: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = cancellations.filter((c) =>
    filter === "ALL" ? true : c.status === filter,
  );

  const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

  return (
    <>
      <div className="fo-section-header">
        <div>
          <div className="fo-section-title">Refund requests</div>
          <div className="fo-section-sub">
            Review and action passenger refund requests
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: filter === f ? 600 : 400,
                border: "1px solid",
                borderColor: filter === f ? "#185FA5" : "#E5E7EB",
                background: filter === f ? "#185FA5" : "#fff",
                color: filter === f ? "#fff" : "#6B7280",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="fo-table-wrap">
        {loading && <div className="fo-loading">Loading cancellations...</div>}
        {error && <div className="fo-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="fo-empty">
            <div className="fo-empty__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="fo-empty__text">No cancellations found</div>
            <div className="fo-empty__sub">
              {filter === "PENDING"
                ? "No pending requests at the moment."
                : `No ${filter.toLowerCase()} cancellations.`}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="fo-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Flight</th>
                <th>Seat</th>
                <th>Requested on</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.cancellationId}>
                  <td>
                    <div className="fo-table__primary">{c.passengerName}</div>
                    <div className="fo-table__secondary">
                      ID #{c.flightPassengerId}
                    </div>
                  </td>
                  <td>
                    <div className="fo-table__primary">{c.flightNumber}</div>
                    <div className="fo-table__secondary">
                      {c.fromCode} → {c.toCode} · {formatDate(c.departureDate)}
                    </div>
                  </td>
                  <td>
                    <div className="fo-table__primary">
                      Row {c.seatRow}, Col {c.seatColumn}
                    </div>
                  </td>
                  <td>
                    <div className="fo-table__primary">
                      {formatDate(c.requestedAt)}
                    </div>
                    <div className="fo-table__secondary">
                      {formatTime(c.requestedAt)}
                    </div>
                  </td>
                  <td style={{ maxWidth: 160 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 150,
                      }}
                    >
                      {c.reason || "—"}
                    </div>
                  </td>
                  <td>
                    <div
                      className="fo-table__primary"
                      style={{ color: "#185FA5" }}
                    >
                      ₹ {Number(c.totalAmount).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <span className={`fo-badge fo-badge--${c.status}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    {c.status === "PENDING" ? (
                      <div className="fo-action-wrap">
                        <button
                          className="fo-btn fo-btn--approve"
                          onClick={() =>
                            setModal({ action: "approve", cancellation: c })
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="fo-btn fo-btn--reject"
                          onClick={() =>
                            setModal({ action: "reject", cancellation: c })
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <ConfirmModal
          action={modal.action}
          cancellation={modal.cancellation}
          onConfirm={modal.action === "approve" ? handleApprove : handleReject}
          onClose={() => setModal(null)}
          loading={actionLoading}
        />
      )}
    </>
  );
}

// ── Dashboard overview tab ────────────────────────────────────────────────────

function DashboardTab({ setActiveTab, cancellations, loading }) {
  return (
    <>
      <MetricCards cancellations={cancellations} />

      <div className="fo-section-header">
        <div className="fo-section-title">Pending cancellations</div>
        <button
          style={{
            fontSize: 13,
            color: "#185FA5",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
          onClick={() => setActiveTab("cancellations")}
        >
          View all →
        </button>
      </div>

      <div className="fo-table-wrap">
        <table className="fo-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Flight</th>
              <th>Amount</th>
              <th>Requested on</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cancellations
              .filter((c) => c.status === "PENDING")
              .slice(0, 3)
              .map((c) => (
                <tr key={c.cancellationId}>
                  <td>
                    <div className="fo-table__primary">{c.passengerName}</div>
                  </td>
                  <td>
                    <div className="fo-table__primary">{c.flightNumber}</div>
                    <div className="fo-table__secondary">
                      {c.fromCode} → {c.toCode}
                    </div>
                  </td>
                  <td>
                    <div
                      className="fo-table__primary"
                      style={{ color: "#185FA5" }}
                    >
                      ₹ {Number(c.totalAmount).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <div className="fo-table__secondary">
                      {formatDateTime(c.requestedAt)}
                    </div>
                  </td>
                  <td>
                    <button
                      className="fo-btn fo-btn--approve"
                      onClick={() => setActiveTab("cancellations")}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Placeholder tabs ──────────────────────────────────────────────────────────

function PlaceholderTab({ title, sub }) {
  return (
    <div className="fo-empty" style={{ marginTop: 40 }}>
      <div className="fo-empty__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="fo-empty__text">{title}</div>
      <div className="fo-empty__sub">{sub}</div>
    </div>
  );
}

// --- RouteManagementTab

// ─────────────────────────────────────────────────────────────────────────────
// RouteManagementTab — drop this into FlightOwnerDashboard.jsx
// Replace the routes PlaceholderTab with <RouteManagementTab />
//

// Edit modal for departure/arrival datetime
function EditRouteModal({ flight, onSave, onClose, loading }) {
  const toInputVal = (iso) => (iso ? iso.slice(0, 16) : "");

  const [depDate, setDepDate] = useState(toInputVal(flight.departureDate));
  const [arrDate, setArrDate] = useState(toInputVal(flight.arrivalDate));

  const handleSave = () => {
    if (!depDate || !arrDate) {
      alert("Both departure and arrival dates are required");
      return;
    }
    if (new Date(arrDate) <= new Date(depDate)) {
      alert("Arrival must be after departure");
      return;
    }
    // Sends LocalDateTime format to your PATCH /api/owner/flights/{id}/route
    onSave(flight.flightId, {
      departureDate: depDate + ":00", // e.g. "2026-03-25T06:15:00"
      arrivalDate: arrDate + ":00",
    });
  };

  return (
    <div className="fo-overlay">
      <div className="fo-modal">
        <div className="fo-modal__title">Edit route schedule</div>
        <div className="fo-modal__sub">
          {flight.flightNumber} · {flight.fromCode} → {flight.toCode}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 5,
            }}
          >
            Departure date & time
          </div>
          <input
            type="datetime-local"
            value={depDate}
            onChange={(e) => setDepDate(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: "0 12px",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
              background: "#F9FAFB",
              color: "#111827",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 5,
            }}
          >
            Arrival date & time
          </div>
          <input
            type="datetime-local"
            value={arrDate}
            onChange={(e) => setArrDate(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: "0 12px",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
              background: "#F9FAFB",
              color: "#111827",
            }}
          />
        </div>

        <div className="fo-modal__actions">
          <button
            className="fo-modal__cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="fo-modal__confirm-btn fo-modal__confirm-btn--approve"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RouteManagementTab() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);
  const [editModal, setEditModal] = useState(null); // flight object
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const flightsAPI = "http://localhost:8080/api/search/owner/flights";
  const updateAPI = "http://localhost:8080/api/search/owner/flights";
  const completedApi = "http://localhost:8080/api/search/owner/flights";

  // ── REPLACE with GET /api/owner/flights ────────────────────────────────────
  useEffect(() => {
    try {
      const getFlights = async () => {
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };
        const response = await axios.get(flightsAPI, config);
        setFlights(response.data);
        setLoading(false);
      };
      getFlights();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [refetch]);

  // ── REPLACE with PATCH /api/owner/flights/{flightId}/route ────────────────
  const handleSaveRoute = async (flightId, body) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    setSaveLoading(true);
    try {
      await axios.put(updateAPI + `/${flightId}/route`, body, config);

      setEditModal(null);
      setRefetch((p) => p + 1);
    } catch (err) {
      alert("Failed to update route: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // ── REPLACE with PATCH /api/owner/flights/{flightId}/status ───────────────
  const handleMarkCompleted = async (flightId) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const confirmed = window.confirm("Mark this flight as COMPLETED?");
    if (!confirmed) return;
    try {
      await axios.put(completedApi + `/${flightId}/complete`, {}, config);

      setRefetch((p) => p + 1);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const STATUS_FILTERS = [
    "ALL",
    "SCHEDULED",
    "DELAYED",
    "COMPLETED",
    "CANCELLED",
  ];

  const filtered = flights.filter((f) =>
    statusFilter === "ALL" ? true : f.status === statusFilter,
  );

  const statusColor = {
    SCHEDULED: { bg: "#EFF6FF", color: "#1D4ED8" },
    DELAYED: { bg: "#FAEEDA", color: "#854F0B" },
    COMPLETED: { bg: "#DCFCE7", color: "#15803D" },
    CANCELLED: { bg: "#FEF2F2", color: "#DC2626" },
  };

  return (
    <>
      <div className="fo-section-header">
        <div>
          <div className="fo-section-title">Route management</div>
          <div className="fo-section-sub">
            Edit schedules and manage status of your flights
          </div>
        </div>
      </div>

      <div className="fo-table-wrap">
        {loading && <div className="fo-loading">Loading flights...</div>}
        {error && <div className="fo-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="fo-empty">
            <div className="fo-empty__text">No flights found</div>
            <div className="fo-empty__sub">
              No flights with status {statusFilter.toLowerCase()}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="fo-table">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Available seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const sc = statusColor[f.status] || {
                  bg: "#F3F4F6",
                  color: "#6B7280",
                };
                const isCompleted = f.status === "COMPLETED";
                const isCancelled = f.status === "CANCELLED";

                return (
                  <tr key={f.flightId}>
                    <td>
                      <div className="fo-table__primary">{f.flightNumber}</div>
                      <div className="fo-table__secondary">
                        ID #{f.flightId}
                      </div>
                    </td>
                    <td>
                      <div className="fo-table__primary">
                        {f.fromCode} → {f.toCode}
                      </div>
                    </td>
                    <td>
                      {f.departureDate !== null ? (
                        <div>
                          <div className="fo-table__primary">
                            {new Date(f.departureDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="fo-table__secondary">
                            {new Date(f.departureDate).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </div>
                      ) : (
                        <div> Not assigned</div>
                      )}
                    </td>
                    <td>
                      {f.arrivalDate !== null ? (
                        <div>
                          <div className="fo-table__primary">
                            {new Date(f.arrivalDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="fo-table__secondary">
                            {new Date(f.arrivalDate).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>Not assigned</div>
                      )}
                    </td>
                    <td>
                      <div className="fo-table__primary">
                        {f.availableSeats}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: sc.bg,
                          color: sc.color,
                        }}
                      >
                        {/* {f.status} */}
                        {f.status.charAt(0) + f.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td>
                      {isCompleted || isCancelled ? (
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          No actions
                        </span>
                      ) : (
                        <div className="fo-action-wrap">
                          <button
                            className="fo-btn fo-btn--approve"
                            onClick={() => setEditModal(f)}
                          >
                            Edit schedule
                          </button>
                          <button
                            className="fo-btn fo-btn--reject"
                            onClick={() => handleMarkCompleted(f.flightId)}
                          >
                            Mark completed
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editModal && (
        <EditRouteModal
          flight={editModal}
          onSave={handleSaveRoute}
          onClose={() => setEditModal(null)}
          loading={saveLoading}
        />
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FlightOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(0);

  const allApi = "http://localhost:8080/api/cancellations/owner/all";

  useEffect(() => {
    const getPending = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      const response = await axios.get(allApi, config);
      setCancellations(response.data);

      setLoading(false);
    };
    getPending();
  }, [refetch]);

  const pc = cancellations.filter((p) => p.status === "PENDING").length;

  console.log("Pending " + pc);

  const tabTitles = {
    dashboard: "Dashboard",
    cancellations: "Cancellation requests",
    routes: "Route management",
    passengers: "Passenger accounts",
  };

  return (
    <div className="fo-page">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCancellations={pc}
      />

      <div className="fo-main">
        <div className="fo-topbar">
          <div className="fo-topbar__title">{tabTitles[activeTab]}</div>
          <div className="fo-topbar__date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="fo-content">
          {activeTab === "dashboard" && (
            <DashboardTab
              setActiveTab={setActiveTab}
              cancellations={cancellations}
              loading={loading}
            />
          )}
          {activeTab === "cancellations" && (
            <CancellationsTab
              cancellations={cancellations}
              loading={loading}
              refetch={() => setRefetch((p) => p + 1)}
            />
          )}
          {activeTab === "routes" && <RouteManagementTab />}
          {activeTab === "passengers" && <PassengerManagementTab />}
        </div>
      </div>
    </div>
  );
}
