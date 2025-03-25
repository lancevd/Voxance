import TopBar from "../components/dashboard/TopBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <TopBar/>
      {children}
    </div>
  );
}
