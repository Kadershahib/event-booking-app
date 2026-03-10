const express = require("express");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// ─── In-Memory Data ───────────────────────────────────────────────────────────
let events = [
  {
    id: "evt-001",
    title: "AI & Machine Learning Summit 2025",
    description: "Explore the future of AI with leading researchers and industry pioneers.",
    date: "2025-08-15T09:00:00.000Z",
    location: "Bangalore, India",
    category: "Technology",
    totalSeats: 120,
    availableSeats: 47,
    price: 1999,
    image: "🤖",
  },
  {
    id: "evt-002",
    title: "Full-Stack Developer Workshop",
    description: "Hands-on workshop covering React, Node.js, and cloud deployment strategies.",
    date: "2025-08-22T10:00:00.000Z",
    location: "Chennai, India",
    category: "Workshop",
    totalSeats: 40,
    availableSeats: 12,
    price: 799,
    image: "💻",
  },
  {
    id: "evt-003",
    title: "Startup Founders Networking Night",
    description: "Connect with founders, investors, and mentors in an informal setting.",
    date: "2025-09-05T18:00:00.000Z",
    location: "Mumbai, India",
    category: "Networking",
    totalSeats: 80,
    availableSeats: 0,
    price: 499,
    image: "🚀",
  },
  {
    id: "evt-004",
    title: "Data Science Bootcamp",
    description: "Intensive 2-day bootcamp covering pandas, ML pipelines, and model deployment.",
    date: "2025-09-12T09:00:00.000Z",
    location: "Hyderabad, India",
    category: "Workshop",
    totalSeats: 60,
    availableSeats: 60,
    price: 2499,
    image: "📊",
  },
  {
    id: "evt-005",
    title: "Product Design Sprint",
    description: "Learn Google's Design Sprint methodology with real product challenges.",
    date: "2025-09-20T10:00:00.000Z",
    location: "Pune, India",
    category: "Design",
    totalSeats: 30,
    availableSeats: 8,
    price: 1299,
    image: "🎨",
  },
  {
    id: "evt-006",
    title: "Cloud Architecture Masterclass",
    description: "Deep-dive into AWS, GCP, and Azure architecture patterns for scalable systems.",
    date: "2025-10-03T09:00:00.000Z",
    location: "Delhi, India",
    category: "Technology",
    totalSeats: 50,
    availableSeats: 33,
    price: 3499,
    image: "☁️",
  },
];

// bookings: { eventId_email: { eventId, name, email, bookedAt } }
const bookings = new Map();

// ─── Utility ──────────────────────────────────────────────────────────────────
function sanitize(str) {
  return String(str).replace(/[<>"'&]/g, "").trim();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Event Booking API is running 🎉" });
});

// GET /events – list all events
app.get("/events", (req, res) => {
  res.json({ success: true, data: events });
});

// GET /events/:id – single event
app.get("/events/:id", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  res.json({ success: true, data: event });
});

// POST /book – book an event
app.post(
  "/book",
  [
    body("eventId").notEmpty().withMessage("eventId is required."),
    body("name")
      .notEmpty().withMessage("Name is required.")
      .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters."),
    body("email")
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail(),
  ],
  (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { eventId, name, email } = req.body;
    const safeName = sanitize(name);

    // Find event
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const event = events[eventIndex];

    // Check seat availability
    if (event.availableSeats <= 0) {
      return res.status(409).json({ success: false, message: "Sorry, this event is sold out." });
    }

    // Prevent duplicate booking (same email per event)
    const bookingKey = `${eventId}_${email}`;
    if (bookings.has(bookingKey)) {
      return res.status(409).json({
        success: false,
        message: "You have already booked a seat for this event.",
      });
    }

    // Confirm booking
    events[eventIndex] = { ...event, availableSeats: event.availableSeats - 1 };
    const booking = {
      id: `bk-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      name: safeName,
      email,
      bookedAt: new Date().toISOString(),
    };
    bookings.set(bookingKey, booking);

    // Simulate email notification (logged to console)
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL NOTIFICATION SENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To:      ${email}
Subject: Booking Confirmed – ${event.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hi ${safeName},

Your booking is confirmed! 🎉

Event:    ${event.title}
Date:     ${new Date(event.date).toDateString()}
Location: ${event.location}
Booking:  ${booking.id}

See you there!
— TheDeepTechVerse Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    res.status(201).json({
      success: true,
      message: "Booking confirmed! A confirmation email has been sent.",
      data: booking,
    });
  }
);

// GET /bookings – list all bookings (admin/demo utility)
app.get("/bookings", (req, res) => {
  res.json({ success: true, data: Array.from(bookings.values()) });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
