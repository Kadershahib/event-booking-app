const API_URL = "http://localhost:4000";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong.");
  }
  return data;
}

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/events`);
  const data = await handleResponse(res);
  return data.data;
}

export async function bookEvent({ eventId, name, email }) {
  const res = await fetch(`${API_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, name, email }),
  });
  return handleResponse(res);
}