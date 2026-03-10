import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const FILTERS = ["All", "Technology", "Workshop", "Networking", "Design"];

export default function EventsPage() {
  const { data: events, isLoading, isError, error, refetch } = useEvents();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = !events ? [] :
    activeFilter === "All" ? events :
    events.filter((e) => e.category === activeFilter);

  return (
    <main style={{maxWidth: "1200px", margin: "0 auto", padding: "40px 24px"}}>
      <div style={{marginBottom: "32px"}}>
        <p style={{color: "#f59e0b", fontSize: "13px", fontWeight: "600", marginBottom: "8px"}}>● Upcoming Events</p>
        <h1 style={{fontFamily: "Syne, sans-serif", fontSize: "48px", fontWeight: "800", color: "#f5f3f0", lineHeight: "1.1", marginBottom: "12px"}}>
          Find your next<br /><span style={{color: "#fbbf24"}}>experience.</span>
        </h1>
        <p style={{color: "#8f8070", fontSize: "15px", maxWidth: "500px"}}>
          Browse curated tech events, workshops, and networking nights — book your seat in seconds.
        </p>
      </div>

      <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px"}}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: "8px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: "600",
            border: "1px solid", cursor: "pointer",
            background: activeFilter === f ? "#f59e0b" : "rgba(255,255,255,0.05)",
            color: activeFilter === f ? "#1c1813" : "#8f8070",
            borderColor: activeFilter === f ? "#f59e0b" : "rgba(255,255,255,0.1)",
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px"}}>
        {isLoading && Array.from({length: 6}).map((_, i) => <SkeletonCard key={i} />)}
        {isError && <ErrorState message={error?.message} onRetry={refetch} />}
        {!isLoading && !isError && filtered.length === 0 && <EmptyState />}
        {!isLoading && !isError && filtered.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </main>
  );
}