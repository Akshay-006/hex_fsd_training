import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/mybookings.css";
import axios from "axios";
import Navbar from "../navbar";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/userAction";

const CLASS_LABELS = {
  BUSINESS_CLASS: "Business class",
  ECONOMY_EXTRA_LEGROOM: "Extra legroom",
  ECONOMY: "Economy",
};

const FILTER_TABS = ["All", "Confirmed", "Completed", "Cancelled"];

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

function cardBorderClass(status) {
  if (status === "CONFIRMED") return "mb-card mb-card--confirmed";
  if (status === "COMPLETED") return "mb-card mb-card--completed";
  if (status === "CANCELLED") return "mb-card mb-card--cancelled";
  return "mb-card";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Navbar1() {
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
    <nav className="mb-navbar">
      <div className="mb-navbar__logo" onClick={() => navigate("/search")}>
        Simply<span>Fly</span>
      </div>
      <Link className="mb-navbar__link" to="/search-flights">
        Search
      </Link>
      <Link className="mb-navbar__link mb-navbar__link--active" to="/bookings">
        My bookings
      </Link>

      <div className="sf-navbar__right">
        <span className="sf-navbar__username">
          {details.username.substring(0, 1).toUpperCase() +
            details.username.substring(1, details.username.length)}
        </span>

        <div className="sf-navbar__avatar">
          {details.username.substring(0, 1).toUpperCase()}
        </div>
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

function StatusBadge({ status }) {
  return (
    <span className={`mb-status-badge mb-status-badge--${status}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function BookingCard({ booking, onCancel }) {
  const canCancel = booking.bookingStatus === "CONFIRMED";
  const isInfant = booking.seatRow === null && booking.seatColumn === null;

  return (
    <div className={cardBorderClass(booking.bookingStatus)}>
      <div className="mb-card__header">
        <span className="mb-card__booking-id">
          Booking #{booking.bookingId}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isInfant && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#FEF9C3",
                color: "#854D0E",
              }}
            >
              Infant — No seat
            </span>
          )}
          <StatusBadge status={booking.bookingStatus} />
        </div>
      </div>

      <div className="mb-card__flight">
        {/* Route */}
        <div>
          <div className="mb-info-block__label">Route</div>
          <div className="mb-route">
            <span className="mb-route__code">{booking.fromCode}</span>
            <div className="mb-route__line" />
            <span className="mb-route__arrow">→</span>
            <div className="mb-route__line" />
            <span className="mb-route__code">{booking.toCode}</span>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
            {booking.fromCity} → {booking.toCity}
          </div>
        </div>

        {/* Flight + date */}
        <div>
          <div className="mb-info-block__label">Flight</div>
          <div className="mb-info-block__val">{booking.flightNumber}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            {formatDate(booking.departureDate)}
          </div>
        </div>

        {/* Time */}
        <div>
          <div className="mb-info-block__label">Time</div>
          <div className="mb-info-block__val">
            {formatTime(booking.departureDate)}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            → {formatTime(booking.arrivalDate)}
          </div>
        </div>

        {/* Seat — shows "Infant" label when no seat */}
        <div>
          <div className="mb-info-block__label">Seat</div>
          {isInfant ? (
            <div
              style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}
            >
              No seat assigned
            </div>
          ) : (
            <>
              <div className="mb-info-block__val mb-info-block__val--blue">
                Row {booking.seatRow}, Col {booking.seatColumn}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                {CLASS_LABELS[booking.seatClass]}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Co-passenger details */}
      {booking.coPassengerName && (
        <div
          style={{
            padding: "10px 14px",
            background: "#F9FAFB",
            borderRadius: 8,
            marginBottom: 12,
            display: "flex",
            gap: 24,
            fontSize: 13,
          }}
        >
          <div>
            <span
              style={{
                color: "#9CA3AF",
                fontSize: 11,
                display: "block",
                marginBottom: 2,
              }}
            >
              {isInfant ? "Infant name" : "Co-passenger"}
            </span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {booking.coPassengerName}
            </span>
          </div>
          <div>
            <span
              style={{
                color: "#9CA3AF",
                fontSize: 11,
                display: "block",
                marginBottom: 2,
              }}
            >
              Age
            </span>
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {booking.coPassengerAge} yrs
            </span>
          </div>
        </div>
      )}

      <div className="mb-card__actions">
        {/* Amount status — hidden for infants since amountStatus is null */}
        {!isInfant && booking.amountStatus && (
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Amount status</div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color:
                  booking.amountStatus === "PAID" ||
                  booking.amountStatus === "REFUNDED"
                    ? "#16A34A"
                    : "#BA7517",
              }}
            >
              {booking.amountStatus.replace(/_/g, " ")}
            </div>
          </div>
        )}

        {/* Cancel — only for confirmed non-infant bookings */}
        {canCancel &&
          {
            /*!isInfant*/
          } && (
            <button
              className="mb-btn mb-btn--cancel"
              onClick={() => onCancel(booking)}
            >
              Cancel booking
            </button>
          )}

        {/* Total — hidden for infants since totalAmount is null */}
        {!isInfant && booking.totalAmount !== null && (
          <div className="mb-amount">
            <span className="mb-amount__label">Total</span>₹{" "}
            {Number(booking.totalAmount).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ activeFilter, onSearch }) {
  return (
    <div className="mb-empty">
      <div className="mb-empty__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mb-empty__title">
        No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} bookings
        found
      </div>
      <div className="mb-empty__sub">
        {activeFilter === "All"
          ? "You haven't booked any flights yet."
          : `You have no ${activeFilter.toLowerCase()} bookings.`}
      </div>
      {activeFilter === "All" && (
        <button className="mb-empty__btn" onClick={onSearch}>
          Search flights
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const bookingApi = "http://localhost:8080/api/booking/passenger";
  const cancelApi = "http://localhost:8080/api/cancellations/request";
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const getBookings = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      try {
        const response = await axios.get(bookingApi, config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getBookings();
  }, [refetch]);

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      `Cancel booking #${booking.bookingId}?\n\nFlight: ${booking.fromCode} → ${booking.toCode}\nAmount: ₹${Number(booking.totalAmount).toLocaleString("en-IN")}`,
    );
    if (!confirmed) return;
    try {
      const req = {
        flightPassengerId: booking.bookingId,
        reason: "Passenger requested",
      };

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      await axios.post(cancelApi, req, config);
      setRefetch((prev) => prev + 1);
    } catch (err) {
      alert("Cancellation failed: " + err.message);
    }
  };

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filtered = bookings.filter((b) => {
    if (activeFilter === "All") return true;
    return b.bookingStatus === activeFilter.toUpperCase();
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mb-page">
      <Navbar1 />

      <div className="mb-body">
        <div className="mb-page-title">My bookings</div>

        {/* Replace bookings.length with your API total count */}
        <div className="mb-page-sub">
          {loading
            ? "Loading..."
            : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} found`}
        </div>

        <div className="mb-filter-tabs">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`mb-filter-tab${activeFilter === tab ? " mb-filter-tab--active" : ""}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <div className="mb-loading">Loading your bookings...</div>}
        {error && <div className="mb-error">{error}</div>}

        {!loading && !error && (
          <div className="mb-list">
            {filtered.length === 0 ? (
              <EmptyState
                activeFilter={activeFilter}
                onSearch={() => navigate("/search-flights")}
              />
            ) : (
              filtered.map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
