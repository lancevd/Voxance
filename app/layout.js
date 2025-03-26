import { Toaster } from "react-hot-toast";
import NavBar from "./components/site/NavBar";
import { AuthProvider } from "./context/authContext";
import "./globals.css";
import NavBarWrapper from "@/utils/NavbarWrapper";

export const metadata = {
  title: "Voxance AI Agent",
  description: "Your AI assistant for learning and productivity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="" data-theme="dark">
        <AuthProvider>
          <NavBarWrapper/>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
