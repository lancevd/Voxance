'use client'
import React from "react";
import { useToastContext } from "./ToastContext";
import Toast from "./Toast";

export default function Toaster() {
  const { toasts, dismissToast } = useToastContext();
  return (
    <div className="fixed top-6 left-1/2 z-[9999] flex flex-col items-center w-full max-w-xs -translate-x-1/2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
} 