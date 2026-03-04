import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "solstice-ui/styles";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
