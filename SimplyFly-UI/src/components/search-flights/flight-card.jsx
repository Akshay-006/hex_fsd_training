import "./searchflights.css";

export default function FlightCard({ flight, onSelect }) {
  const depTime = flight.departureDate.split("T")[1].substring(0, 5);
  const arrTime = flight.arrivalDate.split("T")[1].substring(0, 5);

  return (
    <div
      className={`sf-flight-card${flight.featured ? " sf-flight-card--featured" : ""}`}
    >
      {/* Badge (Cheapest / Fastest) — derive from API results comparison */}
      {flight.flightDesc && (
        <span
          className="sf-flight-card__badge"
          style={{ background: "#EAF3DE", color: "#27500A" }}
        >
          {flight.flightDesc}
        </span>
      )}

      <div className="sf-flight-row">
        {/* Airline */}
        <div>
          <div className="sf-flight-row__airline-code">{flight.code}</div>
          <div className="sf-flight-row__airline-name">{flight.airline}</div>
        </div>

        {/* Route */}
        <div className="sf-route-wrap">
          <div className="sf-time-block">
            <div className="sf-time-block__time">{depTime}</div>
            <div className="sf-time-block__airport">{flight.depAirport}</div>
          </div>

          <div className="sf-route-dot" />
          <div className="sf-route-line">
            <div className="sf-route-line__bar" />
          </div>
          <div className="sf-route-dot" />

          <div className="sf-time-block">
            <div className="sf-time-block__time">{arrTime}</div>
            <div className="sf-time-block__airport">{flight.arrAirport}</div>
          </div>
        </div>

        {/* Duration & Stops */}
        <div>
          <div className="sf-flight-row__duration">
            {flight.durationHours}h {flight.durationMins}m
          </div>
          <div className="sf-flight-row__stops" style={{ color: "#3B6D11" }}>
            {flight.stops}
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="sf-flight-row__price">₹ {flight.minFare}</div>
          <div className="sf-flight-row__price-label">per person</div>
        </div>

        {/* Select — wire onSelect to navigate to Screen 3 with flight.id */}
        <button
          className="sf-select-btn"
          onClick={() => onSelect && onSelect(flight)}
        >
          Select seats
        </button>
      </div>
    </div>
  );
}
