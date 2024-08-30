import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Success = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <h1 className="lg:text-8xl md:text-6xl text-4xl font-bold font-[Exo] text-blue-800">
        Verification Successful!!
      </h1>
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/success",
    element: <Success />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
