export default function EmptyState() {
  return (
    <div style={{gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center"}}>
      <div style={{fontSize: "48px", marginBottom: "16px"}}>📭</div>
      <h3 style={{fontFamily: "Syne, sans-serif", fontWeight: "700", color: "#e8e4de", fontSize: "20px", marginBottom: "8px"}}>No events available</h3>
      <p style={{color: "#756758", fontSize: "14px", maxWidth: "280px"}}>
        There are no events scheduled right now. Check back soon!
      </p>
    </div>
  );
}