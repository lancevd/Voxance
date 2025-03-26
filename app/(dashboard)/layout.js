"use client";
import { useEffect } from "react";
import TopBar from "../components/dashboard/TopBar";
import { useAuth } from "../context/authContext";
import { AuthProvider } from "../context/authContext";

export default function DashboardLayout({ children }) {
  const { checkUserLoggedIn, user } = useAuth();

  useEffect(() => {
    checkUserLoggedIn();
  }, [user]);
  return (
    <div className="dashboard-layout">
      <AuthProvider>
        <TopBar />
        {children}
      </AuthProvider>
    </div>
  );
}
