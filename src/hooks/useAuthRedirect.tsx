import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { supabase } from "../lib/supabaseClient";

export const useAuthRedirect = () => {
	const { user, session } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const protectedRoutes = ["/dashboard", "/admin"];
		const { pathname } = location;

		if (!protectedRoutes.includes(pathname)) return;

		// If auth isn't ready yet, skip redirect
		if (session === undefined) return;

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
	}, [user, session, location, location.pathname, navigate]);
};

// Helper to fetch status
async function fetchStatus(userId: string) {
	const { data, error } = await supabase
		.from("users")
		.select("status")
		.eq("id", userId)
		.single();

	return { data, error };
}
