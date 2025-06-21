import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run redirect logic on protected routes, but NOT on /not-allowed
    const protectedRoutes = ["/dashboard", "/admin"];
    if (!protectedRoutes.includes(location.pathname) || location.pathname === "/not-allowed")
      return;

    const getStatusAndRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // Not logged in, show NotAllowed page
        if (location.pathname !== "/not-allowed") navigate("/not-allowed");
        return;
      }

      const { data: userRecord, error } = await supabase
        .from("users")
        .select("status")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("User lookup failed:", error.message);
        if (location.pathname !== "/not-allowed") navigate("/not-allowed");
        return;
      }

      if (userRecord.status === "APPROVED") {
        // Only redirect to dashboard if not already on dashboard or admin
        if (location.pathname !== "/dashboard" && location.pathname !== "/admin") navigate("/dashboard");
      } else {
        if (location.pathname !== "/not-approved") navigate("/not-approved");
      }
    };

    getStatusAndRedirect();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          getStatusAndRedirect();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, location]);
};
