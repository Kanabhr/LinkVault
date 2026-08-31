import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/Authcontext";
import { LinkProvider } from "./context/Linkcontext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LinkProvider>
        <App />
      </LinkProvider>
    </AuthProvider>
  </StrictMode>,
);
