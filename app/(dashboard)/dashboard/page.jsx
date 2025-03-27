'use client';

import { useAuth } from "@/app/context/authContext";

// app/(dashboard)/page.jsx
export default function DashboardPage() {
  const {user} = useAuth();

  return (
    <main className="p-8 md:p-20 lg:p-48 xl:p-56">
    <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">Welcome Back, <br/> {user ? user.firstName : "User"} </h1>
    </main>
  );
}
