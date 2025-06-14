'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



import { Provider } from 'react-redux';
import { store } from './redux/store';

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>
          <Navbar/>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
