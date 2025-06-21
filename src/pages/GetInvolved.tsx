import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

const GetInvolved = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginQuery = searchParams.get("login") === "true";
  const [isLogin, setIsLogin] = useState(loginQuery);

  useEffect(() => {
    setIsLogin(loginQuery);
  }, [loginQuery]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    lead_id: "",
    role: "STUDENT",
    parent_1_name: "",
    parent_1_email: "",
    parent_1_phone: "",
    parent_2_name: "",
    parent_2_email: "",
    parent_2_phone: "",
  });

  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendError("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: formData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/get-involved?login=true`,
      },
    });
    setResendLoading(false);
    if (error) {
      setResendError(error.message);
    } else {
      alert("Confirmation email resent! Please check your inbox.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowResend(false);
    setResendError("");

    if (isLogin) {
      const { data: signInData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (loginError || !signInData.user) {
        // If the error is about email not confirmed, show resend button
        if (loginError?.message?.toLowerCase().includes("confirm") || loginError?.message?.toLowerCase().includes("verify")) {
          setShowResend(true);
        }
        alert(loginError?.message || "Login failed");
        return;
      }

      // Always check if email is confirmed
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user?.email_confirmed_at) {
        alert("Please verify your email before logging in.");
        setShowResend(true);
        return;
      }

      // Update email_confirmed in users table if not already true
      await supabase
        .from("users")
        .update({ email_confirmed: true })
        .eq("id", user.id)
        .eq("email_confirmed", false);

      // Check if user exists in users table, if not, insert
      const { data: userRow, error: fetchError } = await supabase
        .from("users")
        .select("id, status")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Not found is ok
        alert("Error fetching user status");
        return;
      }

      if (!userRow) {
        // Insert user into users table
        const insertPayload = {
          id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          lead_id: formData.lead_id,
          role: formData.role,
          parent_1_name:
            formData.role === "STUDENT" ? formData.parent_1_name || null : null,
          parent_1_email:
            formData.role === "STUDENT" ? formData.parent_1_email || null : null,
          parent_1_phone:
            formData.role === "STUDENT" ? formData.parent_1_phone || null : null,
          parent_2_name:
            formData.role === "STUDENT" ? formData.parent_2_name || null : null,
          parent_2_email:
            formData.role === "STUDENT" ? formData.parent_2_email || null : null,
          parent_2_phone:
            formData.role === "STUDENT" ? formData.parent_2_phone || null : null,
          status: 'PENDING',
        };
        const { error: dbError } = await supabase
          .from("users")
          .insert(insertPayload);
        if (dbError) {
          alert(dbError.message);
          return;
        }
      }

      if (userRow?.status === "APPROVED") {
        navigate("/dashboard");
      } else {
        navigate("/not-approved");
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/get-involved?login=true`,
        },
      });

      if (signUpError || !data.user) {
        alert(signUpError?.message || "Signup failed");
        return;
      }

      // Insert user into users table immediately after signup (before confirmation)
      const insertPayload = {
        id: data.user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        lead_id: formData.lead_id,
        role: formData.role,
        parent_1_name:
          formData.role === "STUDENT" ? formData.parent_1_name || null : null,
        parent_1_email:
          formData.role === "STUDENT" ? formData.parent_1_email || null : null,
        parent_1_phone:
          formData.role === "STUDENT" ? formData.parent_1_phone || null : null,
        parent_2_name:
          formData.role === "STUDENT" ? formData.parent_2_name || null : null,
        parent_2_email:
          formData.role === "STUDENT" ? formData.parent_2_email || null : null,
        parent_2_phone:
          formData.role === "STUDENT" ? formData.parent_2_phone || null : null,
        status: 'PENDING',
      };
      const { error: dbError } = await supabase
        .from("users")
        .insert(insertPayload);
      if (dbError) {
        alert(dbError.message);
        return;
      }

      alert(
        "Registration successful! Please check your inbox to verify your email. You will be able to log in after an admin approves your account."
      );
      navigate("/get-involved?login=true");
    }
  };

  const toggleLogin = () => {
    const newLogin = !isLogin;
    setIsLogin(newLogin);
    navigate(`/get-involved${newLogin ? "?login=true" : ""}`, {
      replace: true,
    });
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-6 py-24"
      >
        <motion.h1
          className="text-5xl font-extrabold text-center text-[#8a9663] drop-shadow-lg mb-8"
          whileHover={{ scale: 1.02 }}
        >
          {isLogin ? "Welcome Back" : "Get Involved"}
        </motion.h1>

        <div className="mb-6 text-center text-sm text-[#5e6651]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleLogin}
            className="text-[#8a9663] font-semibold hover:underline transition"
          >
            {isLogin ? "Sign up here." : "Log in here."}
          </button>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 bg-white/90 border border-[#cdd1bc] px-10 py-10 rounded-2xl shadow-xl backdrop-blur-xl"
        >
          {showResend && (
            <div className="mb-4 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-[#8a9663] font-semibold underline disabled:opacity-50"
              >
                {resendLoading ? "Resending..." : "Resend Confirmation Email"}
              </button>
              {resendError && (
                <div className="text-red-500 text-sm mt-1">{resendError}</div>
              )}
            </div>
          )}

          {!isLogin && (
            <>
              <select
                name="role"
                onChange={handleChange}
                value={formData.role}
                className="w-full p-3 rounded-lg border border-[#cdd1bc] bg-white text-[#4d5640] font-medium"
              >
                <option value="STUDENT">I’m a Student</option>
                <option value="PARENT">I’m a Parent</option>
              </select>

              <label className="block font-medium mb-1" htmlFor="full_name">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                onChange={handleChange}
                value={formData.full_name}
                required
                className="formInput"
              />

              <label className="block font-medium mb-1" htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                onChange={handleChange}
                value={formData.phone}
                required
                className="formInput"
              />

              <label className="block font-medium mb-1" htmlFor="lead_id">
                Lead ID <span className="text-red-500">*</span>
              </label>
              <input
                id="lead_id"
                name="lead_id"
                onChange={handleChange}
                value={formData.lead_id}
                required
                className="formInput"
              />

              <div className="w-full flex items-center my-6">
                <div className="flex-grow h-px bg-[#cdd1bc]" />
                <span className="mx-4 text-[#6e8b15] font-semibold">
                  Optional
                </span>
                <div className="flex-grow h-px bg-[#cdd1bc]" />
              </div>

              <AnimatePresence>
                {formData.role === "STUDENT" && (
                  <motion.div
                    key="parentInfo"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pt-4"
                  >
                    <p className="font-semibold text-[#6b725a] mb-3">
                      Optional Parent Info
                    </p>
                    <input
                      name="parent_1_name"
                      onChange={handleChange}
                      value={formData.parent_1_name}
                      placeholder="Parent 1 Name"
                      className="formInput mb-4"
                    />
                    <input
                      name="parent_1_email"
                      onChange={handleChange}
                      value={formData.parent_1_email}
                      placeholder="Parent 1 Email"
                      className="formInput mb-4"
                    />
                    <input
                      name="parent_1_phone"
                      onChange={handleChange}
                      value={formData.parent_1_phone}
                      placeholder="Parent 1 Phone"
                      className="formInput mb-4"
                    />
                    <input
                      name="parent_2_name"
                      onChange={handleChange}
                      value={formData.parent_2_name}
                      placeholder="Parent 2 Name"
                      className="formInput mb-4"
                    />
                    <input
                      name="parent_2_email"
                      onChange={handleChange}
                      value={formData.parent_2_email}
                      placeholder="Parent 2 Email"
                      className="formInput mb-4"
                    />
                    <input
                      name="parent_2_phone"
                      onChange={handleChange}
                      value={formData.parent_2_phone}
                      placeholder="Parent 2 Phone"
                      className="formInput"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          <div className="w-full flex items-center my-6">
            <div className="flex-grow h-px bg-[#cdd1bc]" />
            <span className="mx-4 text-[#6e8b15] font-semibold">Account</span>
            <div className="flex-grow h-px bg-[#cdd1bc]" />
          </div>

          <label className="block font-medium mb-1" htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
            className="formInput"
          />

          <label className="block font-medium mb-1" htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            required
            className="formInput"
          />

          <button
            type="submit"
            className="bg-[#8a9663] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#73814f] transition duration-300 shadow-md hover:shadow-lg w-full"
          >
            {isLogin ? "Log In →" : "Sign Up →"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default GetInvolved;
