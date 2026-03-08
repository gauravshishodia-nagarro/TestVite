import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { useSoftResetStore } from "./src/stores/softResetStore";
import "./src/utils/i18n.ts";

import "./assets/styles/global.css";

const Root = () => {
  const appKey = useSoftResetStore((s) => s.appKey);

  return <App key={appKey} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
