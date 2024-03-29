'use client';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import { AuthProvider, useAuth } from '@/providers/authProvider';
import { redirect } from 'next/navigation';
import SideBar from '@/components/SideBar';
import { Toaster } from 'react-hot-toast';
// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"  className='dark'>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers >
          <AuthProvider>
            <div className="flex">
              <div className="hidden lg:block navbar-menu relative z-50">
                <SideBar />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="relative lg:ml-56 ml-0 flex flex-col h-screen ">
                  <Navbar />
                  <main className="px-6 flex-grow">{children}</main>
                </div>
              </div>
            </div>
          </AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
