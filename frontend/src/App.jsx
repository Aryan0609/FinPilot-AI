import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";



export default function App() {
  return <AppRoutes />;
}