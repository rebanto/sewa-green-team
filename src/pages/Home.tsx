import Hero from "~/components/Hero";
import StatsCounter from "~/components/StatsCounter";
import FeaturedEvent from "~/components/FeaturedEvent";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import InfoImpactSection from "~/components/InfoImpactSection";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Home = () => {
  const { justSignedOut } = useAuth();
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    if (justSignedOut) setLogoutMessage("Logged out successfully.");
    else setLogoutMessage("");
  }, [justSignedOut]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
    >
      {/* Logout Message Display */}
      {logoutMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="font-medium">{logoutMessage}</p>
        </div>
      )}

      <Hero />

      {/* Mission + Stats */}
      <motion.section className="max-w-5xl mx-auto px-6 py-20 text-center" variants={fadeUp}>
        <h2 className="text-4xl font-extrabold mb-6 text-[#6b7547] leading-tight">
          Together, We’re Growing a Greener Future 🌍
        </h2>
        <p className="text-[#c27d50] mb-10 text-lg max-w-3xl mx-auto">
          Sewa Green Team is a youth-powered environmental force reshaping communities through
          cleanups, education, and green action.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/about"
            className="inline-block bg-[#f4f3ec] text-[#6b7547] font-semibold px-6 py-3 rounded-full border border-[#cdd1bc] hover:bg-[#e6e8d5] hover:text-[#525c32] transition shadow-sm"
          >
            Learn More About Us
          </Link>
        </div>
        <StatsCounter />
      </motion.section>

      {/* Featured Event Section */}
      <motion.section className="bg-[#f9f8f4] py-20 px-6" variants={fadeUp}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#c27d50] mb-4">🌱 Recent Impact</h2>
          <p className="text-[#6c7358] mb-8">
            These aren’t just events — they’re movements creating lasting change.
          </p>
          <FeaturedEvent />
          <Link
            to="/initiatives"
            className="inline-block mt-8 bg-[#6b7547] text-white px-6 py-3 rounded-full hover:bg-[#525c32] transition shadow-lg hover:scale-105"
          >
            See All Initiatives →
          </Link>
        </div>
      </motion.section>

      <InfoImpactSection />
    </motion.div>
  );
};

export default Home;
