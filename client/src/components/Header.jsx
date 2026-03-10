export default function Header() {
  return (
    <header style={{background: "#1c1813", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <div style={{width: "32px", height: "32px", background: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "12px", color: "#1c1813"}}>
          EV
        </div>
        <span style={{fontFamily: "Syne, sans-serif", fontWeight: "700", fontSize: "18px", color: "#f5f3f0"}}>
          Event<span style={{color: "#fbbf24"}}>Verse</span>
        </span>
      </div>
      <div style={{display: "flex", alignItems: "center", gap: "8px", color: "#8f8070", fontSize: "13px"}}>
        <span style={{width: "8px", height: "8px", borderRadius: "50%", background: "#87a07a", display: "inline-block"}}></span>
        Live seat updates
      </div>
    </header>
  );
}