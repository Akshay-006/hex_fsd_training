import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/seat-test.css";
import axios from "axios";

// ── Constants ─────────────────────────────────────────────────────────────────

const CLASS_LABELS = {
  BUSINESS_CLASS: "Business class",
  ECONOMY_EXTRA_LEGROOM: "Economy extra legroom",
  ECONOMY: "Economy",
};

const SEAT_CSS_CLASS = {
  BUSINESS_CLASS: "sb-seat--business",
  ECONOMY_EXTRA_LEGROOM: "sb-seat--extra",
  ECONOMY: "sb-seat--economy",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupByRow(seats) {
  return seats.reduce((acc, seat) => {
    const row = seat.seatRow;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});
}

function getRowClass(rowSeats) {
  return rowSeats[0]?.seatClass;
}

function splitRow(rowSeats) {
  const sorted = [...rowSeats].sort((a, b) => a.seatColumn - b.seatColumn);
  return {
    left: sorted.filter((s) => s.seatColumn <= 3),
    right: sorted.filter((s) => s.seatColumn > 3),
  };
}

// Returns true if a co-passenger entry has both name and age filled
function isCoPassFilled(cp) {
  return cp.name.trim() !== "" && cp.age !== "";
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ flight, onBack }) {
  return (
    <nav className="sb-navbar">
      <div className="sb-navbar__logo" onClick={onBack}>
        Simply<span>Fly</span>
      </div>
      {flight && (
        <div className="sb-navbar__flight-info">
          <strong>{flight.code}</strong>
          <div className="sb-navbar__dot" />
          <span>
            {flight.depAirport} → {flight.arrAirport}
          </span>
          <div className="sb-navbar__dot" />
          <span>
            {new Date(flight.departureDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}
      <button className="sb-navbar__back" onClick={onBack}>
        ← Back to results
      </button>
    </nav>
  );
}

// ── Seats needed progress bar ─────────────────────────────────────────────────

function SeatsNeededBar({ needed, selected }) {
  return (
    <div className="sb-seats-needed-bar">
      <span className="sb-seats-needed-bar__label">
        Select {needed} seat{needed > 1 ? "s" : ""}
      </span>
      <div className="sb-seats-needed-bar__dots">
        {Array.from({ length: needed }).map((_, i) => (
          <div
            key={i}
            className={`sb-seat-dot${i < selected ? " sb-seat-dot--filled" : ""}`}
          />
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#6B7280" }}>
        {selected} of {needed} selected
      </span>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function SeatLegend() {
  const items = [
    { cls: "sb-legend__box--available", label: "Available" },
    { cls: "sb-legend__box--selected", label: "Selected" },
    { cls: "sb-legend__box--occupied", label: "Occupied" },
    { cls: "sb-legend__box--business", label: "Business" },
    { cls: "sb-legend__box--extra", label: "Extra legroom" },
    { cls: "sb-legend__box--economy", label: "Economy" },
  ];
  return (
    <div className="sb-legend">
      {items.map((item) => (
        <div key={item.label} className="sb-legend__item">
          <div className={`sb-legend__box ${item.cls}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ── Seat grid ─────────────────────────────────────────────────────────────────

function SeatGrid({ seats, selectedIds, maxReached, onSeatClick }) {
  const grouped = groupByRow(seats);
  const rowNums = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
  let lastClass = null;

  return (
    <div className="sb-plane">
      <div className="sb-plane__nose" />
      <div className="sb-col-headers">
        {[1, 2, 3].map((c) => (
          <div key={c} className="sb-col-header">
            {c}
          </div>
        ))}
        <div className="sb-col-aisle" />
        {[4, 5, 6].map((c) => (
          <div key={c} className="sb-col-header">
            {c}
          </div>
        ))}
      </div>

      {rowNums.map((rowNum) => {
        const rowSeats = grouped[rowNum];
        const rowClass = getRowClass(rowSeats);
        const { left, right } = splitRow(rowSeats);
        const showLabel = rowClass !== lastClass;
        lastClass = rowClass;

        return (
          <div key={rowNum}>
            {showLabel && (
              <div
                className={`sb-class-label ${
                  rowClass === "BUSINESS_CLASS"
                    ? "sb-class-label--business"
                    : rowClass === "ECONOMY_EXTRA_LEGROOM"
                      ? "sb-class-label--extra"
                      : "sb-class-label--economy"
                }`}
              >
                {CLASS_LABELS[rowClass]}
              </div>
            )}
            <div className="sb-seat-row">
              <div className="sb-row-num">{rowNum}</div>
              <div className="sb-seats-left">
                {left.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedIds.includes(seat.id)}
                    isMaxed={maxReached && !selectedIds.includes(seat.id)}
                    onClick={() => onSeatClick(seat)}
                  />
                ))}
              </div>
              <div className="sb-aisle">·</div>
              <div className="sb-seats-right">
                {right.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedIds.includes(seat.id)}
                    isMaxed={maxReached && !selectedIds.includes(seat.id)}
                    onClick={() => onSeatClick(seat)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SeatButton({ seat, isSelected, isMaxed, onClick }) {
  const occupied = !seat.isAvailable;
  const classStr = [
    "sb-seat",
    SEAT_CSS_CLASS[seat.seatClass] || "",
    isSelected ? "sb-seat--selected" : "",
    occupied ? "sb-seat--occupied" : "",
    isMaxed ? "sb-seat--maxed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classStr}
      onClick={occupied || (isMaxed && !isSelected) ? undefined : onClick}
      disabled={occupied || (isMaxed && !isSelected)}
      title={
        occupied
          ? "Already booked"
          : isMaxed
            ? "Max seats selected"
            : `Row ${seat.seatRow}, Col ${seat.seatColumn} — ₹ ${Number(seat.fare).toLocaleString("en-IN")}`
      }
    >
      {seat.seatRow}-{seat.seatColumn}
    </button>
  );
}

// ── Flight summary card ───────────────────────────────────────────────────────

function FlightSummaryCard({ flight }) {
  if (!flight) return null;
  return (
    <div className="sb-card">
      <div className="sb-card__title">Flight details</div>
      <div className="sb-info-row">
        <span className="sb-info-label">Flight</span>
        <span className="sb-info-val">{flight.code}</span>
      </div>
      <div className="sb-info-row">
        <span className="sb-info-label">Route</span>
        <span className="sb-info-val">
          {flight.depAirport} → {flight.arrAirport}
        </span>
      </div>
      <div className="sb-info-row">
        <span className="sb-info-label">Date</span>
        <span className="sb-info-val">
          {new Date(flight.departureDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="sb-info-row">
        <span className="sb-info-label">Departure</span>
        <span className="sb-info-val">
          {new Date(flight.departureDate).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="sb-info-row">
        <span className="sb-info-label">Arrival</span>
        <span className="sb-info-val">
          {new Date(flight.arrivalDate).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// ── Co-passenger input row (reused for both seat co-pax and infants) ──────────
// label      — e.g. "Passenger 1", "Infant 1"
// tag        — small colored pill next to label e.g. "Seat" or "No seat"
// tagColor   — hex for the tag background
// coPass     — { name, age }
// onChange   — (field, value) => void

function CoPassForm({ label, tag, tagBg, tagColor, coPass, onChange }) {
  return (
    <div className="sb-selected-item">
      <div className="sb-selected-item__header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="sb-selected-item__seat-label">{label}</div>
          {tag && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 4,
                background: tagBg,
                color: tagColor,
              }}
            >
              {tag}
            </span>
          )}
        </div>
        {/* Mandatory indicator */}
        <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
          required
        </span>
      </div>

      <div className="sb-selected-item__body">
        <div className="sb-copax-fields">
          <input
            className={`sb-form-input-sm${!coPass.name.trim() ? " sb-form-input-sm--error" : ""}`}
            type="text"
            placeholder="Full name *"
            value={coPass.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
          <input
            className={`sb-form-input-sm sb-form-input-sm--age${!coPass.age ? " sb-form-input-sm--error" : ""}`}
            type="number"
            placeholder="Age *"
            min={1}
            max={120}
            value={coPass.age}
            onChange={(e) => onChange("age", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Selected seats + infant details card ──────────────────────────────────────
//
// seatSelections = [{ seat, coPassenger: { name, age } }]
// infantDetails  = [{ name, age }]   one per infant count

function PassengerDetailsCard({
  seatSelections,
  infantDetails,
  totalSeatsNeeded,
  onRemoveSeat,
  onSeatCoPassChange,
  onInfantChange,
}) {
  const totalFare = seatSelections.reduce(
    (sum, s) => sum + Number(s.seat.fare),
    0,
  );
  const tax = Math.round(totalFare * 0.05);
  const total = totalFare + tax;

  const noSeatsYet = seatSelections.length === 0 && infantDetails.length === 0;

  return (
    <div className="sb-card">
      <div className="sb-card__title">
        Passenger details
        <span
          style={{
            fontSize: 12,
            color: "#185FA5",
            fontWeight: 400,
            marginLeft: 8,
          }}
        >
          {seatSelections.length} / {totalSeatsNeeded} seats
        </span>
      </div>

      {noSeatsYet ? (
        <div className="sb-no-seat">
          <div className="sb-no-seat__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M5 10h14M5 10l-2 9h18l-2-9"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="sb-no-seat__text">
            Select seats from the map to fill passenger details
          </div>
        </div>
      ) : (
        <>
          <div className="sb-selected-list">
            {/* ── One form per selected seat ─────────────────────────── */}
            {seatSelections.map((sel, index) => (
              <div key={sel.seat.id}>
                {/* Seat header with remove */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    marginTop: index > 0 ? 10 : 0,
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}
                  >
                    SEAT {index + 1} — Row {sel.seat.seatRow}, Col{" "}
                    {sel.seat.seatColumn}
                    &nbsp;·&nbsp;{CLASS_LABELS[sel.seat.seatClass]}
                    &nbsp;·&nbsp;₹{" "}
                    {Number(sel.seat.fare).toLocaleString("en-IN")}
                  </span>
                  <button
                    className="sb-selected-item__remove"
                    onClick={() => onRemoveSeat(sel.seat.id)}
                    title="Remove this seat"
                  >
                    ×
                  </button>
                </div>

                <CoPassForm
                  label={`Passenger ${index + 1}`}
                  tag="Seat"
                  tagBg="#EFF6FF"
                  tagColor="#1D4ED8"
                  coPass={sel.coPassenger}
                  onChange={(field, value) =>
                    onSeatCoPassChange(sel.seat.id, field, value)
                  }
                />
              </div>
            ))}

            {/* ── One form per infant ────────────────────────────────── */}
            {infantDetails.map((infant, index) => (
              <div key={`infant-${index}`} style={{ marginTop: 10 }}>
                <CoPassForm
                  label={`Infant ${index + 1}`}
                  tag="No seat"
                  tagBg="#FEF9C3"
                  tagColor="#854D0E"
                  coPass={infant}
                  onChange={(field, value) =>
                    onInfantChange(index, field, value)
                  }
                />
              </div>
            ))}
          </div>

          {/* Price breakdown — only if seats are selected */}
          {seatSelections.length > 0 && (
            <>
              <div
                style={{ height: 1, background: "#F3F4F6", margin: "14px 0" }}
              />
              <div className="sb-price-row">
                <span>
                  Base fare ({seatSelections.length} seat
                  {seatSelections.length > 1 ? "s" : ""})
                </span>
                <span>₹ {totalFare.toLocaleString("en-IN")}</span>
              </div>
              <div className="sb-price-row">
                <span>Taxes & fees (5%)</span>
                <span>₹ {tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="sb-price-total">
                <span>Total</span>
                <span>₹ {total.toLocaleString("en-IN")}</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Success modal ─────────────────────────────────────────────────────────────

function SuccessModal({ bookings, onClose }) {
  const grandTotal = bookings.reduce(
    (sum, b) => sum + Number(b.totalAmount),
    0,
  );

  return (
    <div className="sb-overlay">
      <div className="sb-success-modal">
        <div className="sb-success-modal__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="sb-success-modal__title">
          {bookings.length > 1 ? "All seats booked!" : "Booking confirmed!"}
        </div>
        <div className="sb-success-modal__sub">
          {bookings.length} seat{bookings.length > 1 ? "s" : ""} booked
          successfully.
        </div>

        {bookings.map((b, i) => (
          <div key={b.bookingId} className="sb-success-modal__booking">
            <div className="sb-success-modal__booking-title">
              Seat {i + 1} — Booking #{b.bookingId}
            </div>
            <div className="sb-success-modal__row">
              <span>Flight</span>
              <span>{b.flightNumber}</span>
            </div>
            <div className="sb-success-modal__row">
              <span>Seat</span>
              <span>
                Row {b.seatRow}, Col {b.seatColumn}
              </span>
            </div>
            <div className="sb-success-modal__row">
              <span>Class</span>
              <span>{CLASS_LABELS[b.seatClass]}</span>
            </div>
            <div className="sb-success-modal__row">
              <span>Status</span>
              <span style={{ color: "#16A34A" }}>{b.bookingStatus}</span>
            </div>
            <div className="sb-success-modal__row">
              <span>Fare</span>
              <span>₹ {Number(b.totalAmount).toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}

        <div className="sb-success-modal__total">
          <span>Grand total</span>
          <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
        </div>

        <button className="sb-success-modal__btn" onClick={onClose}>
          Go to my bookings
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SeatBookingTest() {
  const { flightId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const flight = state?.flight;
  const paxCounts = state?.paxCounts;

  // Seats needed = adults + children (infants don't need seats)
  const totalSeatsNeeded = paxCounts
    ? (paxCounts.adult || 1) + (paxCounts.children || 0)
    : 1;

  // Infant count — they need details but no seat
  const infantCount = paxCounts?.infant || 0;

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookings, setBookings] = useState(null);
  const bookingApi = "http://localhost:8080/api/booking/create";

  // seatSelections: [{ seat, coPassenger: { name, age } }]
  // coPassenger is MANDATORY for every seat — no toggle
  const [seatSelections, setSeatSelections] = useState([]);

  // infantDetails: [{ name, age }] — one per infant, no seat involved
  const [infantDetails, setInfantDetails] = useState(
    Array.from({ length: infantCount }, () => ({ name: "", age: "" })),
  );

  const selectedIds = seatSelections.map((s) => s.seat.id);
  const maxReached = seatSelections.length >= totalSeatsNeeded;

  // ── Fetch seats ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const getSeats = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      try {
        const response = await axios.get(
          `http://localhost:8080/api/seats/${flightId}`,
          config,
        );
        setSeats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getSeats();
  }, [flightId]);

  // ── Seat click — toggle select / deselect ───────────────────────────────────
  const handleSeatClick = (seat) => {
    setSeatSelections((prev) => {
      const exists = prev.find((s) => s.seat.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.seat.id !== seat.id);
      }
      if (prev.length >= totalSeatsNeeded) return prev;
      // Each seat starts with an empty mandatory co-passenger form
      return [...prev, { seat, coPassenger: { name: "", age: "" } }];
    });
  };

  // ── Remove a seat ───────────────────────────────────────────────────────────
  const handleRemoveSeat = (seatId) => {
    setSeatSelections((prev) => prev.filter((s) => s.seat.id !== seatId));
  };

  // ── Update co-passenger details for a seat ──────────────────────────────────
  const handleSeatCoPassChange = (seatId, field, value) => {
    setSeatSelections((prev) =>
      prev.map((s) =>
        s.seat.id === seatId
          ? { ...s, coPassenger: { ...s.coPassenger, [field]: value } }
          : s,
      ),
    );
  };

  // ── Update infant details ───────────────────────────────────────────────────
  const handleInfantChange = (index, field, value) => {
    setInfantDetails((prev) =>
      prev.map((inf, i) => (i === index ? { ...inf, [field]: value } : inf)),
    );
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  // All seats selected AND every seat's co-passenger filled AND every infant filled
  const allSeatCoPassFilled = seatSelections.every((s) =>
    isCoPassFilled(s.coPassenger),
  );
  const allInfantsFilled = infantDetails.every(isCoPassFilled);

  const canConfirm =
    seatSelections.length === totalSeatsNeeded &&
    allSeatCoPassFilled &&
    allInfantsFilled;

  // ── Confirm booking ─────────────────────────────────────────────────────────
  const handleConfirmBooking = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    setBookingError(null);

    const token = localStorage.getItem("token");

    // Build seatBookings list — every seat has a mandatory co-passenger
    const seatBookings = seatSelections.map((s) => ({
      seatId: s.seat.id,
      coPassengerDto: {
        name: s.coPassenger.name,
        age: Number(s.coPassenger.age),
      },
    }));

    // Append infants as extra co-passengers on the first booking row
    // They have no seatId — backend handles them as coPassengers only
    // Adjust this structure if your backend expects infants separately
    const infantBookings = infantDetails.map((inf) => ({
      seatId: -1,
      coPassengerDto: { name: inf.name, age: Number(inf.age) },
    }));

    const body = {
      flightId: Number(flightId),
      seatBookings: [...seatBookings, ...infantBookings],
    };

    console.log(body);

    try {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const response = await axios.post(bookingApi, body, config);
      console.log(response.data);

      // List<BookingResponseDTO>
      setBookings(response.data);
      // Flip booked seats to unavailable in local grid
      const bookedIds = seatSelections.map((s) => s.seat.id);
      setSeats((prev) =>
        prev.map((s) =>
          bookedIds.includes(s.id) ? { ...s, isAvailable: false } : s,
        ),
      );
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="sb-page">
      <Navbar flight={flight} onBack={() => navigate(-1)} />

      <SeatsNeededBar
        needed={totalSeatsNeeded}
        selected={seatSelections.length}
      />

      {loading && <div className="sb-loading">Loading seat map...</div>}
      {error && <div className="sb-error">{error}</div>}

      {!loading && !error && (
        <div className="sb-body">
          {/* Left — seat map */}
          <div className="sb-seat-panel">
            <div className="sb-seat-panel__title">Choose your seats</div>
            <div className="sb-seat-panel__sub">
              Select {totalSeatsNeeded} seat{totalSeatsNeeded > 1 ? "s" : ""}.
              {infantCount > 0 &&
                ` Fill details for ${infantCount} infant${infantCount > 1 ? "s" : ""} on the right.`}
              &nbsp;Click a selected seat to deselect it.
            </div>
            <SeatLegend />
            <SeatGrid
              seats={seats}
              selectedIds={selectedIds}
              maxReached={maxReached}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* Right — passenger details + confirm */}
          <div className="sb-right-panel">
            <FlightSummaryCard flight={flight} />

            <PassengerDetailsCard
              seatSelections={seatSelections}
              infantDetails={infantDetails}
              totalSeatsNeeded={totalSeatsNeeded}
              onRemoveSeat={handleRemoveSeat}
              onSeatCoPassChange={handleSeatCoPassChange}
              onInfantChange={handleInfantChange}
            />

            {bookingError && (
              <div
                style={{ fontSize: 13, color: "#DC2626", textAlign: "center" }}
              >
                {bookingError}
              </div>
            )}

            {/* Hint text when form is incomplete */}
            {!canConfirm && seatSelections.length > 0 && (
              <div
                style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}
              >
                Fill all passenger details to confirm
              </div>
            )}

            <button
              className="sb-confirm-btn"
              disabled={!canConfirm || submitting}
              onClick={handleConfirmBooking}
            >
              {submitting
                ? "Confirming..."
                : `Confirm ${seatSelections.length > 0 ? seatSelections.length : ""} booking${seatSelections.length > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}

      {bookings && (
        <SuccessModal
          bookings={bookings}
          onClose={() => navigate("/bookings")}
        />
      )}
    </div>
  );
}
