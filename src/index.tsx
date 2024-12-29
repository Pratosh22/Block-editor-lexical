import React from "react";
import ReactDOM from "react-dom/client";
import {
  ThemeProvider,
  TooltipProvider
} from "@sparrowengg/twigs-react";
import App from "./App";

const rootEl =
  document.getElementById("root");
if (rootEl) {
  const root =
    ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ThemeProvider
        theme={{
          fonts: {
            body: "'DM sans', sans-serif",
            heading:
              "'DM sans', sans-serif"
          },
          colors: {
            system900: "#3E90FD"
          }
        }}
      >
        <TooltipProvider
          delayDuration={100}
        >
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
