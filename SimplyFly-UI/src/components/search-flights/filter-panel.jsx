import "./searchflights.css";
import CheckItem from "./check-item";
import { useState } from "react";

// Replace HARDCODED_AIRLINES with airlines derived from your API results:
// const airlines = [...new Set(flights.map(f => f.airline))]
const HARDCODED_AIRLINES = ["IndiGo", "Air India", "SpiceJet", "Vistara"];

const STOPS = [
  { label: "Non-stop", count: "12", key: "nonstop" },
  { label: "1 stop", count: "8", key: "one" },
  { label: "2+ stops", count: "3", key: "two" },
];

const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];

export default function FilterPanel({
  checkedStops,
  toggleStop,
  checkedAirlines,
  toggleAirline,
  activeTime,
  setActiveTime,
  minFare,
  setMinFare,
  maxFare,
  setMaxFare,
}) {
  const [minFare1, setMinFare1] = useState(2500);
  const [maxFare1, setMaxFare1] = useState(18000);
  return (
    <div className="sf-filter-panel">
      <div className="sf-filter-panel__title">Filters</div>

      {/* Stops filter — wire checkedStops to your flight filtering logic */}
      <div className="sf-filter-section">
        <div className="sf-filter-section__head">Stops</div>
        {STOPS.map((s) => (
          <CheckItem
            key={s.key}
            label={s.label}
            checked={checkedStops.includes(s.key)}
            onChange={() => toggleStop(s.key)}
          />
        ))}
      </div>

      {/* Price range — replace static bar with a real range input bound to your price filter state */}
      {/* <div className="sf-filter-section">
        <div className="sf-filter-section__head">Price range</div>
        <div className="sf-range-labels">
          <span>₹ 2,500</span>
          <span>₹ 18,000</span>
        </div>
        <div className="sf-range-track">
          <div className="sf-range-fill" />
        </div>
      </div> */}
      <div className="sf-filter-section">
        <div className="sf-filter-section__head">Price range</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
        >
          <span>₹ {minFare.toLocaleString("en-IN")}</span>
          <span>₹ {maxFare.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={2500}
          max={18000}
          step={500}
          value={maxFare}
          onChange={(e) => setMaxFare(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#185FA5", cursor: "pointer" }}
        />
      </div>

      {/* Airlines filter — replace HARDCODED_AIRLINES with API-derived list */}
      <div className="sf-filter-section">
        <div className="sf-filter-section__head">Airlines</div>
        {HARDCODED_AIRLINES.map((a) => (
          <CheckItem
            key={a}
            label={a}
            checked={checkedAirlines.includes(a)}
            onChange={() => toggleAirline(a)}
          />
        ))}
      </div>

      {/* Departure time — wire activeTime to your flight filtering logic */}
      <div className="sf-filter-section">
        <div className="sf-filter-section__head">Departure time</div>
        <div className="sf-time-grid">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              className={`sf-time-chip${activeTime === t ? " sf-time-chip--active" : ""}`}
              onClick={() => setActiveTime(activeTime === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
