import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CalendarProvider } from "./calendarContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <CalendarProvider>
    <App />
  </CalendarProvider>
);
