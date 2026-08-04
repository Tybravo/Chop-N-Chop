import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/landing/Navbar"; 
import { CartSidebar } from "@/components/CartSidebar";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Chopnchop - Scheduled Food Delivery",
  description: "Order your daily meals with guaranteed delivery slots. Zero waste, zero wait.",
  icons: {
    // icon: "/Chopnchop-logo01.png",
    icon: "/logo_icon.png",

  },
};

// Inline script to prevent FOUC (Flash of Unstyled Content) on initial load
const themeInitScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('chopnchop-theme');
      var isDark = savedTheme === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider>
          <AdminAuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <CartSidebar />
            
            {/* The old footer block has been completely removed from here */}

          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}