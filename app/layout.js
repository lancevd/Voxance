import { Toaster } from "react-hot-toast";
import NavBar from "./components/site/NavBar";
import { AuthProvider } from "./context/authContext";
import "./globals.css";
import NavBarWrapper from "@/app/components/site/NavbarWrapper";
import { ToastProvider } from "@/app/components/ToastContext";
import ToasterCustom from "@/app/components/Toaster";

export const metadata = {
  title: "Voxance AI Agent",
  description: "Your AI assistant for learning and productivity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900">
        <ToastProvider>
          <AuthProvider>
            <NavBarWrapper />
            <ToasterCustom />
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
