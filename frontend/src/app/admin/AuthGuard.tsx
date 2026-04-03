"use client";

import { useAuth } from "hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Remember where we were going
        const returnUrl = encodeURIComponent(pathname);
        router.replace(`/admin/login`);
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading || !authorized) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
