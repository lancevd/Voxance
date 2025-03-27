"use client";
import { useEffect } from "react";
import TopBar from "../components/dashboard/TopBar";
import { useAuth } from "../context/authContext";
import { AuthProvider } from "../context/authContext";

export default function DashboardLayout({ children }) {
  const { checkUserLoggedIn } = useAuth();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  return (
    <div className="dashboard-layout">
        <TopBar />
        {children}
    </div>
  );
}
