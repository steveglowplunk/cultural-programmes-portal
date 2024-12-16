import type { Metadata } from "next";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Source_Sans_3 } from "next/font/google";
import { AuthContextProvider } from "@/providers/auth-provider";
import "@/theme/custom-styles.css";
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
  title: "Cultural Programmes Portal"
};

const sourceSans3 = Source_Sans_3({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const style = document.createElement('style')
              style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
              style.setAttribute('type', 'text/css')
              document.querySelector('head').prepend(style)
            `,
          }}
        />
      </head>
      <AuthContextProvider>
        <PrimeReactProvider>
          <body className={sourceSans3.className}>{children}</body>
        </PrimeReactProvider>
      </AuthContextProvider>
    </html>
  );
}