import React from "react";

const typeStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
  loading: "bg-gray-700 text-white",
  default: "bg-gray-800 text-white",
};

export default function Toast({ message, type = "default", onClose }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg mb-3 animate-toast-in ${typeStyles[type] || typeStyles.default}`}
      role="alert"
    >
      {type === "success" && <span>✅</span>}
      {type === "error" && <span>❌</span>}
      {type === "info" && <span>ℹ️</span>}
      {type === "loading" && <span className="animate-spin">⏳</span>}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/70 hover:text-white text-lg font-bold focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
      <style jsx>{`
        .animate-toast-in {
          animation: toastIn 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes toastIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
} 