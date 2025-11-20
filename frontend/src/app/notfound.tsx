"use client";

import Link from "next/link";
import { Frown } from "lucide-react";
import "@/styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <Frown size={96} className="not-found-icon" />
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-text">
        Oops! The page you're looking for doesn’t exist.
      </p>
      <Link href="/" className="go-home-button">
        Go Back to Homepage
      </Link>
    </div>
  );
}
