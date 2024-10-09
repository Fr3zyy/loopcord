"use client";
import { getAuthData } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/user";
import React, { useEffect } from "react";

export function AuthProvider({ children }) {
  const { setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getAuthData();
        if (response && response.data) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching user data");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setLoading, setError]);

  return <>{children}</>;
}

export default AuthProvider;