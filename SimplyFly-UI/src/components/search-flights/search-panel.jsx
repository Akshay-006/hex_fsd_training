import axios from "axios";
import "./searchflights.css";
import { useState, useRef, useEffect } from "react";

// Replace these with values from your search state / API response
// const AIRPORTS = [
//   { code: "MAA", name: "Chennai Intl. Airport", city: "Chennai" },
//   { code: "BOM", name: "Chhatrapati Shivaji Intl.", city: "Mumbai" },
//   { code: "DEL", name: "Indira Gandhi Intl.", city: "Delhi" },
//   { code: "BLR", name: "Kempegowda Intl.", city: "Bengaluru" },
//   { code: "HYD", name: "Rajiv Gandhi Intl.", city: "Hyderabad" },
//   { code: "CCU", name: "Netaji Subhas Chandra Intl.", city: "Kolkata" },
//   { code: "COK", name: "Cochin Intl.", city: "Kochi" },
//   { code: "PNQ", name: "Pune Airport", city: "Pune" },
//   { code: "AMD", name: "Sardar Vallabhbhai Patel Intl.", city: "Ahmedabad" },
//   { code: "GOI", name: "Goa Intl.", city: "Goa" },
// ];

const CLASSES = ["ECONOMY", "ECONOMY_EXTRA_LEGROOM", "BUSINESS_CLASS"];
const TRIP_TYPES = ["One way", "Round trip", "Multi-city"];

// ── Airport Dropdown ───────────────────────────────────────────────────────────

function AirportDropdown({ label, value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef();
  const [AIRPORTS, setAirports1] = useState([]);
  const api = "http://localhost:8080/api/airport/get-all";
  useEffect(() => {
    const getFlights = async () => {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const response = await axios.get(api, config);

      setAirports1(response.data);
    };
    getFlights();
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = AIRPORTS.find((a) => a.code === value);
  const filtered = AIRPORTS.filter(
    (a) =>
      a.code !== exclude &&
      (a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="sf-field-group" ref={ref} style={{ position: "relative" }}>
      <span className="sf-field-label">{label}</span>
      <div
        className="sf-field-box sf-field-box--clickable"
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
      >
        {selected ? (
          <>
            <div className="sf-field-box__main">
              {selected.city} ({selected.code})
            </div>
            <div className="sf-field-box__sub">{selected.name}</div>
          </>
        ) : (
          <div className="sf-field-box__placeholder">Select airport</div>
        )}
      </div>

      {open && (
        <div className="sf-dropdown">
          <input
            className="sf-dropdown__search"
            autoFocus
            placeholder="Search city or code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="sf-dropdown__list">
            {filtered.length === 0 && (
              <div className="sf-dropdown__empty">No airports found</div>
            )}
            {filtered.map((a) => (
              <div
                key={a.code}
                className={`sf-dropdown__item${value === a.code ? " sf-dropdown__item--selected" : ""}`}
                onClick={() => {
                  onChange(a.code);
                  setOpen(false);
                }}
              >
                <div className="sf-dropdown__item-city">
                  {a.city}
                  <span className="sf-dropdown__item-code">{a.code}</span>
                </div>
                <div className="sf-dropdown__item-meta">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Date Field ─────────────────────────────────────────────────────────────────

function DateField({ label, value, onChange }) {
  const inputRef = useRef();

  const display = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="sf-field-group" style={{ position: "relative" }}>
      <span className="sf-field-label">{label}</span>
      <div
        className="sf-field-box sf-field-box--clickable"
        onClick={() =>
          inputRef.current?.showPicker?.() || inputRef.current?.focus()
        }
      >
        {display ? (
          <div className="sf-field-box__main">{display}</div>
        ) : (
          <div className="sf-field-box__placeholder">Select date</div>
        )}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => onChange(e.target.value)}
          className="sf-date-hidden-input"
        />
      </div>
    </div>
  );
}

// ── Passenger & Class Dropdown ─────────────────────────────────────────────────

function PassengerDropdown({ counts, setCounts, cabinClass, setCabinClass }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const total = counts.adult + counts.children + counts.infant;
  const label = `${total} Traveller${total !== 1 ? "s" : ""}, ${cabinClass}`;

  const change = (type, delta) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(type === "adult" ? 1 : 0, prev[type] + delta),
    }));
  };

  const PAX_ROWS = [
    { key: "adult", label: "Adult", sub: "12+ Years" },
    { key: "children", label: "Children", sub: "2 – 12 yrs" },
    { key: "infant", label: "Infant", sub: "Below 2 yrs" },
  ];

  return (
    <div className="sf-field-group" ref={ref} style={{ position: "relative" }}>
      <span className="sf-field-label">Passengers</span>
      <div
        className="sf-field-box sf-field-box--clickable"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="sf-field-box__main">{label}</div>
      </div>

      {open && (
        <div className="sf-pax-dropdown">
          <div className="sf-pax-section-title">Travellers</div>

          {PAX_ROWS.map(({ key, label: pLabel, sub }) => (
            <div key={key} className="sf-pax-row">
              <div className="sf-pax-row__info">
                <div className="sf-pax-row__label">{pLabel}</div>
                <div className="sf-pax-row__sub">{sub}</div>
              </div>
              <div className="sf-pax-row__counter">
                <button
                  className="sf-pax-btn"
                  onClick={() => change(key, -1)}
                  disabled={counts[key] <= (key === "adult" ? 1 : 0)}
                >
                  <svg width="12" height="2" viewBox="0 0 12 2">
                    <rect width="12" height="2" rx="1" fill="currentColor" />
                  </svg>
                </button>
                <span className="sf-pax-count">{counts[key]}</span>
                <button
                  className="sf-pax-btn sf-pax-btn--plus"
                  onClick={() => change(key, 1)}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <rect
                      x="5"
                      width="2"
                      height="12"
                      rx="1"
                      fill="currentColor"
                    />
                    <rect
                      y="5"
                      width="12"
                      height="2"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="sf-pax-divider" />

          <div className="sf-pax-section-title">Class</div>
          <div className="sf-class-grid">
            {CLASSES.map((c) => (
              <button
                key={c}
                className={`sf-class-chip${cabinClass === c ? " sf-class-chip--active" : ""}`}
                onClick={() => setCabinClass(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button className="sf-pax-update-btn" onClick={() => setOpen(false)}>
            Update
          </button>
        </div>
      )}
    </div>
  );
}

// ── Search Panel ───────────────────────────────────────────────────────────────

export default function SearchPanel({ tripType, setTripType, onSearch }) {
  const [fromCode, setFromCode] = useState("MAA");
  const [toCode, setToCode] = useState("BOM");
  const [depDate, setDepDate] = useState("2026-03-25T00:00:00.000Z");
  const [paxCounts, setPaxCounts] = useState({
    adult: 1,
    children: 0,
    infant: 0,
  });
  const [cabinClass, setCabinClass] = useState("ECONOMY");

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // Wire handleSearch to your flight search API call
  const handleSearch = async () => {
    const neededSeats = paxCounts.adult + paxCounts.children + paxCounts.infant;
    const payload = {
      fromCode,
      toCode,
      depDate,
      neededSeats,
      cabinClass,
      paxCounts,
    };
    onSearch(payload);

    console.log("Search payload:", payload);
  };

  return (
    <div className="sf-search-panel">
      <div className="sf-trip-tabs">
        {TRIP_TYPES.map((t) => (
          <button
            key={t}
            className={`sf-trip-tab${tripType === t ? " sf-trip-tab--active" : ""}`}
            onClick={() => setTripType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="sf-search-fields">
        <AirportDropdown
          label="From"
          value={fromCode}
          onChange={setFromCode}
          exclude={toCode}
        />

        <div className="sf-swap-col">
          <button
            className="sf-swap-btn"
            onClick={handleSwap}
            title="Swap airports"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11 1L14 4L11 7M3 4h11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 9L2 12L5 15M13 12H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <AirportDropdown
          label="To"
          value={toCode}
          onChange={setToCode}
          exclude={fromCode}
        />

        <DateField
          label="Departure date"
          value={depDate}
          onChange={setDepDate}
        />

        <PassengerDropdown
          counts={paxCounts}
          setCounts={setPaxCounts}
          cabinClass={cabinClass}
          setCabinClass={setCabinClass}
        />

        <button className="sf-search-btn" onClick={handleSearch}>
          Search flights
        </button>
      </div>
    </div>
  );
}
