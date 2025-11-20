"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirectTo = encodeURIComponent(pathname);
      router.replace(`/user/login?redirect=${redirectTo}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
