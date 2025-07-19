"use client";
import TopBar from "@/components/dashboard/TopBar";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";


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
