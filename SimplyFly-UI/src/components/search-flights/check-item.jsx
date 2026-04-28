import "./searchflights.css";

export default function CheckItem({ label, count, checked, onChange }) {
  return (
    <div className="sf-check-row" onClick={onChange}>
      <div className={`sf-checkbox${checked ? " sf-checkbox--checked" : ""}`}>
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.5 6L8 1"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="sf-check-row__text">{label}</span>
      {count && <span className="sf-check-row__count">{count}</span>}
    </div>
  );
}
