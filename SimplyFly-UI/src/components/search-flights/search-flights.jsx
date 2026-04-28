import { useState, useRef, useEffect } from "react";
import "./searchflights.css";

import Navbar from "../navbar";
import SearchPanel from "./search-panel";
import FilterPanel from "./filter-panel";
import FlightCard from "./flight-card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SORT_OPTIONS = [
  { label: "Cheapest first", value: "cheapest" },
  { label: "Fastest first", value: "fastest" },
];

// ── Sort Dropdown ──────────────────────────────────────────────────────────────

function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="sf-sort-btn" onClick={() => setOpen((o) => !o)}>
        Sort: {current?.label} ▾
      </button>
      {open && (
        <div className="sf-sort-dropdown">
          {SORT_OPTIONS.map((o) => (
            <div
              key={o.value}
              className={`sf-sort-dropdown__item${sortBy === o.value ? " sf-sort-dropdown__item--active" : ""}`}
              onClick={() => {
                setSortBy(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────

export default function SimplyFlySearch() {
  const [tripType, setTripType] = useState("One way");
  //const [checkedStops, setCheckedStops] = useState(["nonstop", "one"]);
  // const [checkedAirlines, setCheckedAirlines] = useState([
  //   "IndiGo",
  //   "Air India",
  // ]);
  //const [activeTime, setActiveTime] = useState("Morning");
  const [sortBy, setSortBy] = useState("cheapest");

  const [flights, setFlights] = useState([]);
  const [resultsFound, setResultsFound] = useState(0);
  const [fromCity, setFromCity] = useState(undefined);
  const [toCity, setToCity] = useState(undefined);
  const [travelDate, setTravelDate] = useState(undefined);
  const flightApi = "http://localhost:8080/api/search/flights/v2";
  const navigate = useNavigate();
  const [paxCounts, setPaxCounts] = useState({});

  const [checkedStops, setCheckedStops] = useState([]);
  const [checkedAirlines, setCheckedAirlines] = useState([]);
  const [activeTime, setActiveTime] = useState(null);
  const [minFare, setMinFare] = useState(2500);
  const [maxFare, setMaxFare] = useState(18000);
  const [depTimeFilter, setDepTimeFilter] = useState("");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [stopsFilter, setStopsFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");

  const handleSearch = async (payload) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    const body = {
      fromCode: payload.fromCode,
      toCode: payload.toCode,
      departureDate: payload.depDate,
      neededSeats: payload.neededSeats,
      seatClass: payload.cabinClass,
    };
    setPaxCounts(payload.paxCounts);

    const response = await axios.post(flightApi, body, config);
    setFlights(response.data.data);
    setResultsFound(response.data.totalElements);
    setFromCity(response.data.data.depAirport);
    setToCity(response.data.data.arrAirport);
    setTravelDate(payload.depDate);
  };

  const toggleStop = (key) =>
    setCheckedStops((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const toggleAirline = (a) =>
    setCheckedAirlines((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  // Sort flights locally — replace with API sort param when wiring backend
  const sortedFlights = [...flights].sort((a, b) =>
    sortBy === "cheapest"
      ? a.priceValue - b.priceValue
      : a.durationMins - b.durationMins,
  );

  // Wire to your router — e.g. navigate(`/seats/${flight.id}`)
  const handleSelectFlight = (flight) => {
    navigate(`/seats/${flight.id}`, { state: { flight, paxCounts } });
    console.log("Selected flight:", flight);
  };

  return (
    <div className="sf-page">
      <Navbar />

      <div className="sf-body">
        <SearchPanel
          tripType={tripType}
          setTripType={setTripType}
          onSearch={handleSearch}
        />

        {/* <div className="sf-layout"> */}
        {/*<FilterPanel
            checkedStops={checkedStops}
            toggleStop={toggleStop}
            checkedAirlines={checkedAirlines}
            toggleAirline={toggleAirline}
            activeTime={activeTime}
            setActiveTime={setActiveTime}
            minFare={minFare}
            setMinFare={setMinFare}
            maxFare={maxFare}
            setMaxFare={setMaxFare}
          />*/}

        <div className="sf-results-area">
          <div className="sf-results-header">
            {/* Replace with your API total count and search params */}
            <div className="sf-results-count">
              {resultsFound} flights found {/*on {travelDate}*/}
            </div>
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {/* Replace sortedFlights with your sorted/filtered API results */}
          {sortedFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onSelect={handleSelectFlight}
            />
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
}
