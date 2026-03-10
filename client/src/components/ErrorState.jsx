export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center"}}>
      <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
      <h3 style={{fontFamily: "Syne, sans-serif", fontWeight: "700", color: "#e8e4de", fontSize: "20px", marginBottom: "8px"}}>Failed to load events</h3>
      <p style={{color: "#756758", fontSize: "14px", maxWidth: "280px", marginBottom: "24px"}}>
        {message || "Could not connect to the server."}
      </p>
      {onRetry && (
        <button onClick={onRetry} style={{padding: "10px 24px", borderRadius: "12px", background: "#f59e0b", color: "#1c1813", fontWeight: "700", fontSize: "14px", border: "none", cursor: "pointer"}}>
          Try again
        </button>
      )}
    </div>
  );
}