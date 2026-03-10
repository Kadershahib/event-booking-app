import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useBooking } from "../hooks/useBooking";

function validate(name, email) {
  const errors = {};
  if (!name.trim() || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (name.trim().length > 100) {
    errors.name = "Name must be under 100 characters.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  return errors;
}

export default function BookingModal({ event, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const { mutate: book, isPending } = useBooking();
  const overlayRef = useRef(null);
  const nameRef = useRef(null);

  // Focus first input on open
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !isPending) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isPending]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(name, email));
  }

  function handleSubmit() {
    setTouched({ name: true, email: true });
    const errs = validate(name, email);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    book(
      { eventId: event.id, name: name.trim(), email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          setSuccess(true);
          toast.success(`Booking confirmed! Check ${email} for your confirmation.`);
        },
        onError: (err) => {
          toast.error(err.message || "Booking failed. Please try again.");
        },
      }
    );
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current && !isPending) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-ink-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-slide-in overflow-hidden">
        {/* Accent top bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/6 flex items-start gap-3">
          <span className="text-2xl mt-0.5">{event.image}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-ink-50 text-base leading-snug line-clamp-2">
              {event.title}
            </h2>
            <p className="text-ink-500 text-xs mt-0.5">{formattedDate}</p>
          </div>
          {!isPending && (
            <button
              onClick={onClose}
              className="text-ink-500 hover:text-ink-200 transition-colors text-xl leading-none mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="text-center py-4 space-y-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
              <div className="text-5xl">🎉</div>
              <div>
                <h3 className="font-display font-semibold text-ink-50 text-lg">You're in!</h3>
                <p className="text-ink-400 text-sm mt-1">
                  A confirmation has been sent to{" "}
                  <span className="text-amber-400 font-mono text-xs">{email}</span>.
                </p>
              </div>
              <div className="bg-ink-800/60 rounded-xl p-4 text-sm text-ink-300 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-500">Event</span>
                  <span className="text-ink-100 font-medium text-right max-w-[60%]">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Name</span>
                  <span className="text-ink-100">{name.trim()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Date</span>
                  <span className="text-ink-100">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Location</span>
                  <span className="text-ink-100">{event.location}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 text-ink-200 font-display font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-ink-400 text-sm">Fill in your details to reserve a seat.</p>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ink-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) setErrors(validate(e.target.value, email));
                  }}
                  onBlur={() => handleBlur("name")}
                  placeholder="Kader Hussain"
                  className={`w-full bg-ink-800/60 border rounded-xl px-4 py-2.5 text-sm text-ink-100 placeholder-ink-600 outline-none transition-all focus:ring-2 ${
                    touched.name && errors.name
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/8 focus:border-amber-500/50 focus:ring-amber-500/20"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-ink-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setErrors(validate(name, e.target.value));
                  }}
                  onBlur={() => handleBlur("email")}
                  placeholder="you@example.com"
                  className={`w-full bg-ink-800/60 border rounded-xl px-4 py-2.5 text-sm text-ink-100 placeholder-ink-600 outline-none transition-all focus:ring-2 ${
                    touched.email && errors.email
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/8 focus:border-amber-500/50 focus:ring-amber-500/20"
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Price info */}
              <div className="flex items-center justify-between bg-ink-800/40 rounded-xl px-4 py-3 text-sm border border-white/5">
                <span className="text-ink-400">Seat price</span>
                <span className="font-mono font-semibold text-amber-400">
                  {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-ink-950 font-display font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-ink-900/40 border-t-ink-900 rounded-full animate-spin" />
                    Confirming…
                  </>
                ) : (
                  "Confirm Booking →"
                )}
              </button>

              <p className="text-center text-ink-600 text-xs">
                A confirmation will be sent to your email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
