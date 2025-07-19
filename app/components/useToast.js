import { useToastContext } from "./ToastContext";

export default function useToast() {
  const { showToast, dismissToast } = useToastContext();
  return { showToast, dismissToast };
} 