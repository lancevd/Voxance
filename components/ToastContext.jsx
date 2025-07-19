'use client'
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, { type = "default", duration = 3000 } = {}) => {
    const id = ++toastId;
    setToasts((toasts) => [...toasts, { id, message, type }]);
    if (type !== "loading") {
      setTimeout(() => {
        setToasts((toasts) => toasts.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
} 