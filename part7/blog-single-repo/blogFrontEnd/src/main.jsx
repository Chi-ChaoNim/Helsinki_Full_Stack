import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App2 from "./App2.jsx";
import { NotificationContextProvider } from "./NotificationContext.jsx";
import { UserContextProvider } from "./UserContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <UserContextProvider>
            <App2 />
          </UserContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
);
