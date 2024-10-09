import "./globals.css";
import { ThemeProvider } from "@/components/Providers/Theme";
import AuthProvider from "@/components/Providers/Auth";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "LoopCord #SOON",
  description: "LoopCord description.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Toaster
              toastOptions={{
                className: "bg-accent text-foreground border-2 border-border",
              }}
            />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
