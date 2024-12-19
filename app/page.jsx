"use client"; // Mark the file as a Client Component

import { useRouter } from "next/navigation"; // Correct import for App Router
import { useEffect } from "react";

export default function HomeRedirect() {
  const router = useRouter(); // Hook for navigation in the App directory

  useEffect(() => {
    router.push("/app"); // This redirects to the /app route
  }, [router]);

  return null; // Render nothing while redirecting
}
