import { useState } from "react";
import BookingModal from "./BookingModal";

export default function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const isSoldOut = event.availableSeats === 0;
  const isLow = event.availableSeats > 0 && event.availableSeats <= 10;

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  const pct = Math.round((event.availableSeats / event.totalSeats) * 100);

  return (
    <>
      <div style={{borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(40,33,28,0.8)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px"}}>
        
        {/* Top */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
          <span style={{fontSize: "32px"}}>{event.image}</span>
          <span style={{fontSize: "11px", fontWeight: "600", padding: "4px 12px", borderRadius: "999px", background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)"}}>
            {event.category}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 style={{fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "18px", color: "#f5f3f0", marginBottom: "6px", lineHeight: "1.3"}}>
            {event.title}
          </h2>
          <p style={{color: "#756758", fontSize: "13px", lineHeight: "1.6"}}>{event.description}</p>
        </div>

        {/* Meta */}
        <div style={{display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#8f8070"}}>
          <span>📅 {formattedDate}</span>
          <span>📍 {event.location}</span>
          <span style={{color: "#fbbf24", fontWeight: "700"}}>💳 {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}</span>
        </div>

        {/* Seat bar */}
        <div>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px"}}>
            <span style={{color: isSoldOut ? "#f87171" : isLow ? "#fbbf24" : "#87a07a", fontWeight: "600"}}>
              {isSoldOut ? "SOLD OUT" : isLow ? `Only ${event.availableSeats} left!` : `${event.availableSeats} seats`}
            </span>
            {!isSoldOut && <span style={{color: "#756758"}}>{event.totalSeats} total</span>}
          </div>
          {!isSoldOut && (
            <div style={{height: "4px", borderRadius: "999px", background: "rgba(255,255,255,0.08)"}}>
              <div style={{height: "100%", borderRadius: "999px", width: `${pct}%`, background: isLow ? "#f59e0b" : "#87a07a"}} />
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => setShowModal(true)}
          disabled={isSoldOut}
          style={{
            width: "100%", padding: "12px", borderRadius: "12px", border: "none",
            fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "14px",
            cursor: isSoldOut ? "not-allowed" : "pointer",
            background: isSoldOut ? "rgba(255,255,255,0.05)" : "#f59e0b",
            color: isSoldOut ? "#5e5246" : "#1c1813",
          }}
        >
          {isSoldOut ? "Sold Out" : "Book Now →"}
        </button>
      </div>

      {showModal && <BookingModal event={event} onClose={() => setShowModal(false)} />}
    </>
  );
}