import { Toaster } from "react-hot-toast";
import NavBar from "@/components/site/NavBar";
import { AuthProvider } from "@/context/authContext";
import "./globals.css";
import NavBarWrapper from "@/components/site/NavbarWrapper";
import { ToastProvider } from "@/components/ToastContext";
import ToasterCustom from "@/components/Toaster";

const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('color-theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};

export const metadata = {
  title: "Voxance AI Agent",
  description: "Your AI assistant for learning and productivity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
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
