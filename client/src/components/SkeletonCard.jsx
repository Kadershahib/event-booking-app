export default function SkeletonCard() {
  return (
    <div style={{borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(30,25,20,0.6)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div className="skeleton" style={{width: "40px", height: "40px", borderRadius: "8px"}} />
        <div className="skeleton" style={{width: "80px", height: "24px", borderRadius: "20px"}} />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
        <div className="skeleton" style={{height: "20px", borderRadius: "8px", width: "80%"}} />
        <div className="skeleton" style={{height: "16px", borderRadius: "8px", width: "100%"}} />
        <div className="skeleton" style={{height: "16px", borderRadius: "8px", width: "60%"}} />
      </div>
      <div className="skeleton" style={{height: "40px", borderRadius: "12px"}} />
    </div>
  );
}