"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth/login?mode=signup");
  }, [router]);

  return null;
}
