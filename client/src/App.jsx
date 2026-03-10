import Header from "./components/Header";
import EventsPage from "./pages/EventsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <EventsPage />
      </div>
      <footer className="border-t border-white/5 py-6 text-center text-gray-600 text-xs">
        EventVerse · Built for TheDeepTechVerse Assessment · 2025
      </footer>
    </div>
  );
}