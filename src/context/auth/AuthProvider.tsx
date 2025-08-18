import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "~/lib/supabase";
import { type User, type Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [justSignedOut, setJustSignedOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const protectedRoutes = ["/dashboard", "/admin"];
  const { pathname } = location;

  if (session && protectedRoutes.includes(pathname)) {
    (async () => {
      if (!user) {
        return pathname !== "/not-allowed" && navigate("/not-allowed");
      }

      // Fetch user's status from DB
      const { data: userRecord, error } = await fetchStatus(user.id);
      if (error || !userRecord) {
        console.error("User lookup failed:", error?.message);
        return pathname !== "/not-allowed" && navigate("/not-allowed");
      }

      if (userRecord.status === "APPROVED") {
        if (pathname === "/not-approved") navigate("/dashboard");
      } else {
        if (pathname !== "/not-approved") navigate("/not-approved");
      }
    })();
  }

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
