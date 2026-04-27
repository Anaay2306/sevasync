"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, roleRedirects, type StoredUser } from "@/lib/auth";
import { Navigation } from "@/components/navigation";
import { CommunityBar, CommunityProvider } from "@/components/community-shell";

const publicRoutes = new Set(["/login", "/signup"]);

export function AuthShell({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const isPublic = publicRoutes.has(pathname);

    if (!currentUser && !isPublic) {
      router.replace("/login");
      setReady(true);
      return;
    }

    if (currentUser && isPublic) {
      router.replace(roleRedirects[currentUser.role]);
      setReady(true);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return <body className={className ? `${className} min-h-screen bg-field` : "min-h-screen bg-field"} />;
  }

  const showNavigation = Boolean(user) && !publicRoutes.has(pathname);

  return (
    <body className={className}>
      <CommunityProvider>
        {showNavigation && <Navigation />}
        {showNavigation && <CommunityBar />}
        {children}
      </CommunityProvider>
    </body>
  );
}
