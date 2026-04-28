import { useState, useEffect } from "react";
import "../styles/passenger-management.css";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// HARDCODED DATA — replace with API calls as noted in comments
// ─────────────────────────────────────────────────────────────────────────────

const HARDCODED_PASSENGERS = [
  {
    passengerId: 1,
    name: "Arjun Mehta",
    age: 28,
    gender: "MALE",
    email: "arjun.mehta@email.com",
    contactNumber: "9876543210",
    totalBookings: 3,
    totalAmountSpent: 15750.0,
  },
  {
    passengerId: 2,
    name: "Priya Sharma",
    age: 24,
    gender: "FEMALE",
    email: "priya.sharma@email.com",
    contactNumber: "9123456780",
    totalBookings: 1,
    totalAmountSpent: 5250.0,
  },
  {
    passengerId: 3,
    name: "Rahul Das",
    age: 35,
    gender: "MALE",
    email: "rahul.das@email.com",
    contactNumber: "9988776655",
    totalBookings: 2,
    totalAmountSpent: 10500.0,
  },
  {
    passengerId: 4,
    name: "Sneha Iyer",
    age: 30,
    gender: "FEMALE",
    email: "sneha.iyer@email.com",
    contactNumber: "9001122334",
    totalBookings: 1,
    totalAmountSpent: 8500.0,
  },
];

const HARDCODED_DETAIL = {
  1: {
    passengerId: 1,
    name: "Arjun Mehta",
    age: 28,
    gender: "MALE",
    email: "arjun.mehta@email.com",
    contactNumber: "9876543210",
    address: "12, MG Road, Chennai, Tamil Nadu - 600001",
    bookings: [
      {
        bookingId: 101,
        flightNumber: "6E 234",
        fromCode: "MAA",
        toCode: "BOM",
        departureDate: "2026-03-25T06:15:00",
        seatRow: "3",
        seatColumn: 2,
        seatClass: "ECONOMY",
        bookingStatus: "CONFIRMED",
        amountStatus: "YET_TO_BE_CREDITED",
        totalAmount: 5250.0,
      },
      {
        bookingId: 98,
        flightNumber: "6E 234",
        fromCode: "MAA",
        toCode: "BOM",
        departureDate: "2026-01-10T06:15:00",
        seatRow: "1",
        seatColumn: 4,
        seatClass: "BUSINESS_CLASS",
        bookingStatus: "COMPLETED",
        amountStatus: "PAID",
        totalAmount: 15000.0,
      },
      {
        bookingId: 85,
        flightNumber: "6E 234",
        fromCode: "MAA",
        toCode: "BOM",
        departureDate: "2025-12-05T06:15:00",
        seatRow: null,
        seatColumn: null,
        seatClass: null,
        bookingStatus: "CONFIRMED",
        amountStatus: null,
        totalAmount: null,
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CLASS_LABELS = {
  BUSINESS_CLASS: "Business",
  ECONOMY_EXTRA_LEGROOM: "Extra legroom",
  ECONOMY: "Economy",
};

const STATUS_COLOR = {
  CONFIRMED: { bg: "#EFF6FF", color: "#1D4ED8" },
  COMPLETED: { bg: "#DCFCE7", color: "#15803D" },
  CANCELLED: { bg: "#FEF2F2", color: "#DC2626" },
};

// ── Passenger Detail Panel ────────────────────────────────────────────────────

function DetailPanel({ passengerId }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = "http://localhost:8080/api/passenger";

  useEffect(() => {
    if (!passengerId) return;
    // setLoading(true);
    // setDetail(null);
    // setError(null);

    try {
      const getPassengerDetails = async () => {
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };
        const response = await axios.get(api + `/${passengerId}`, config);
        setDetail(response.data);
        setLoading(false);
      };
      getPassengerDetails();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [passengerId]);

  if (!passengerId) {
    return (
      <div className="fo-detail-panel">
        <div className="fo-detail-panel__empty">
          <div className="fo-empty__icon" style={{ margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="fo-empty__text">No passenger selected</div>
          <div className="fo-empty__sub">
            Click a passenger to view their details
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fo-detail-panel">
        <div className="fo-detail-loading">Loading passenger details...</div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="fo-detail-panel">
        <div className="fo-detail-loading" style={{ color: "#DC2626" }}>
          {error || "Passenger not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="fo-detail-panel">
      {/* Header */}
      <div className="fo-detail-header">
        <div className="fo-detail-avatar">{getInitials(detail.name)}</div>
        <div>
          <div className="fo-detail-header__name">{detail.name}</div>
          <div className="fo-detail-header__email">{detail.email}</div>
        </div>
      </div>

      {/* Personal info */}
      <div className="fo-detail-section">
        <div className="fo-detail-section__title">Personal details</div>
        <div className="fo-detail-grid">
          <div>
            <div className="fo-detail-field__label">Age</div>
            <div className="fo-detail-field__val">{detail.age} yrs</div>
          </div>
          <div>
            <div className="fo-detail-field__label">Gender</div>
            <div className="fo-detail-field__val">
              {detail.gender
                ? detail.gender.charAt(0) + detail.gender.slice(1).toLowerCase()
                : "—"}
            </div>
          </div>
          <div>
            <div className="fo-detail-field__label">Contact</div>
            <div className="fo-detail-field__val">
              {detail.contactNumber || "—"}
            </div>
          </div>
          <div>
            <div className="fo-detail-field__label">Total bookings</div>
            <div className="fo-detail-field__val" style={{ color: "#185FA5" }}>
              {detail.bookings.length}
            </div>
          </div>
        </div>

        {detail.address && (
          <div style={{ marginTop: 10 }}>
            <div className="fo-detail-field__label">Address</div>
            <div
              className="fo-detail-field__val"
              style={{
                fontWeight: 400,
                fontSize: 12,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {detail.address}
            </div>
          </div>
        )}
      </div>

      {/* Booking history */}
      <div
        className="fo-detail-section"
        style={{ borderBottom: "none", paddingBottom: 0 }}
      >
        <div className="fo-detail-section__title">Booking history</div>
      </div>

      <div className="fo-booking-history">
        {detail.bookings.length === 0 ? (
          <div
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            No bookings found
          </div>
        ) : (
          detail.bookings.map((b) => {
            const isInfant = b.seatRow === null;
            const sc = STATUS_COLOR[b.bookingStatus] || {
              bg: "#F3F4F6",
              color: "#6B7280",
            };

            return (
              <div key={b.bookingId} className="fo-booking-item">
                <div className="fo-booking-item__header">
                  <div>
                    <div className="fo-booking-item__flight">
                      {b.flightNumber}
                    </div>
                    <div className="fo-booking-item__route">
                      {b.fromCode} → {b.toCode} · {formatDate(b.departureDate)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    {b.bookingStatus.charAt(0) +
                      b.bookingStatus.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="fo-booking-item__row">
                  <span>
                    {isInfant ? (
                      <span
                        style={{
                          fontSize: 11,
                          background: "#FEF9C3",
                          color: "#854D0E",
                          padding: "1px 7px",
                          borderRadius: 4,
                        }}
                      >
                        Infant — no seat
                      </span>
                    ) : (
                      `Row ${b.seatRow}, Col ${b.seatColumn} · ${CLASS_LABELS[b.seatClass] || b.seatClass}`
                    )}
                  </span>
                  {!isInfant && b.totalAmount && (
                    <span className="fo-booking-item__amount">
                      ₹ {Number(b.totalAmount).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {!isInfant && b.amountStatus && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 11,
                      color:
                        b.amountStatus === "PAID" ||
                        b.amountStatus === "REFUNDED"
                          ? "#16A34A"
                          : "#BA7517",
                      fontWeight: 600,
                    }}
                  >
                    {b.amountStatus.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main PassengerManagementTab ───────────────────────────────────────────────

export default function PassengerManagementTab() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const api = "http://localhost:8080/api/passenger/owner/get-all";

  useEffect(() => {
    const getPassengers = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };

        const response = await axios.get(api, config);
        setPassengers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getPassengers();
  }, []);

  const filtered = passengers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.contactNumber?.includes(search),
  );

  return (
    <>
      <div className="fo-section-header">
        <div>
          <div className="fo-section-title">Passenger accounts</div>
          <div className="fo-section-sub">
            {loading
              ? "Loading..."
              : `${passengers.length} passenger${passengers.length !== 1 ? "s" : ""} on your flights`}
          </div>
        </div>
      </div>

      <div className="fo-passenger-layout">
        {/* Left — passenger list */}
        <div>
          <div className="fo-search-bar">
            <input
              className="fo-search-input"
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <div className="fo-loading">Loading passengers...</div>}
          {error && <div className="fo-error">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="fo-empty">
              <div className="fo-empty__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="fo-empty__text">No passengers found</div>
              <div className="fo-empty__sub">
                {search
                  ? `No results for "${search}"`
                  : "No passengers have booked your flights yet"}
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="fo-passenger-list">
              {filtered.map((p) => (
                <div
                  key={p.passengerId}
                  className={`fo-passenger-card${selectedPassenger === p.passengerId ? " fo-passenger-card--active" : ""}`}
                  onClick={() => setSelectedPassenger(p.passengerId)}
                >
                  <div className="fo-passenger-card__row">
                    <div className="fo-passenger-avatar">
                      {getInitials(p.name)}
                    </div>

                    <div className="fo-passenger-card__info">
                      <div className="fo-passenger-card__name">{p.name}</div>
                      <div className="fo-passenger-card__meta">
                        {p.email} ·{" "}
                        {p.gender
                          ? p.gender.charAt(0) + p.gender.slice(1).toLowerCase()
                          : "—"}{" "}
                        · {p.age} yrs
                      </div>
                    </div>

                    <div className="fo-passenger-card__stats">
                      <div className="fo-passenger-card__bookings">
                        {p.totalBookings} booking
                        {p.totalBookings !== 1 ? "s" : ""}
                      </div>
                      <div className="fo-passenger-card__spent">
                        ₹ {Number(p.totalAmountSpent).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — detail panel */}
        <DetailPanel passengerId={selectedPassenger} />
      </div>
    </>
  );
}
