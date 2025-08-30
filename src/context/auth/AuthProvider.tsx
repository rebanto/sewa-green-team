import { useEffect, useState, useRef, useMemo, type ReactNode } from "react";
import { supabase } from "~/lib/supabase";
import { type User, type Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [justSignedOut, setJustSignedOut] = useState(false);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const lastAuthCheckRef = useRef(0);

  useEffect(() => {
    // Initialize session & user
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    init();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const { pathname } = location;
  const protectedRoutes = useMemo(() => ["/dashboard", "/admin"], []);

  // Use useEffect to handle auth checks properly
  useEffect(() => {
    if (!session || !protectedRoutes.includes(pathname)) return;
    if (authCheckInProgress) return; // Prevent multiple simultaneous auth checks

    // Debounce rapid auth checks (prevent checking more than once per 500ms)
    const now = Date.now();
    if (now - lastAuthCheckRef.current < 500) return;
    lastAuthCheckRef.current = now;

    const checkAuth = async () => {
      setAuthCheckInProgress(true);

      try {
        if (!user) {
          console.error("Navigated by AuthProvider - no user");
          if (pathname !== "/not-allowed") {
            navigateRef.current("/not-allowed");
          }
          return;
        }

        // Fetch user's status from DB
        const { data: userRecord, error } = await fetchStatus(user.id);

        if (error || !userRecord) {
          console.error("User lookup failed:", error?.message);
          if (pathname !== "/not-allowed") {
            navigateRef.current("/not-allowed");
          }
          return;
        }

        if (userRecord.status === "APPROVED") {
          if (pathname === "/not-approved") {
            navigateRef.current("/dashboard");
          }
        } else {
          if (pathname !== "/not-approved") {
            navigateRef.current("/not-approved");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Don't redirect on network errors, let the user retry
      } finally {
        setAuthCheckInProgress(false);
      }
    };

    checkAuth();
  }, [session, user, pathname, protectedRoutes, authCheckInProgress]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setJustSignedOut(true);
    setTimeout(() => setJustSignedOut(false), 2000);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, justSignedOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper to fetch status
async function fetchStatus(userId: string) {
  const { data, error } = await supabase.from("users").select("status").eq("id", userId).single();

  return { data, error };
}
