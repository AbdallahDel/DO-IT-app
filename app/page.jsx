"use client"; // Mark the file as a Client Component

import { useRouter } from "next/navigation"; // Use the correct import for app directory
import { useEffect } from "react";

export default function HomeRedirect() {
  const router = useRouter(); // Correct hook for app directory

  useEffect(() => {
    router.push("/app"); // Use `push` instead of `replace` in next/navigation
  }, [router]);

  return null; // Render nothing while redirecting
}


