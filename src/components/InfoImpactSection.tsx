import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLeaf, FaHandsHelping, FaGlobeAmericas } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

// --- Info Cards ---
const infoCards = [
  {
    name: "Who We Are",
    desc: "Learn about our mission, team, and values.",
    to: "/about",
    icon: <FaLeaf className="text-3xl text-[#6b7547] mb-4" />,
  },
  {
    name: "What We Do",
    desc: "Explore our cleanups and sustainability programs.",
    to: "/initiatives",
    icon: <FaGlobeAmericas className="text-3xl text-[#6b7547] mb-4" />,
  },
  {
    name: "Partner With Us",
    desc: "Want to collaborate? Let’s make it happen.",
    to: "/contact",
    icon: <FaHandsHelping className="text-3xl text-[#6b7547] mb-4" />,
  },
];

// --- Mobile InfoImpactSection ---
type InfoCard = {
  name: string;
  desc: string;
  to: string;
  icon: React.ReactNode;
};

const MobileInfoImpactSection = ({ infoCards }: { infoCards: InfoCard[] }) => (
  <section className="relative py-8 px-3 text-center bg-gradient-to-br from-[#f4f3ec] via-[#ebe7d9] to-[#dba979] overflow-hidden">
    <h2 className="text-2xl font-extrabold text-[#c27d50] mb-4 inline-block underline">
      The Movement is Growing 🌿
    </h2>
    <p className="text-[#6c7358] max-w-xs mx-auto mb-7 text-base font-medium">
      Whether you’re a student, parent, or organization — there’s a place for you in our mission to
      restore and protect the planet.
    </p>
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 mb-8">
      {infoCards.map((card: InfoCard) => (
        <div
          key={card.to}
          className="rounded-xl bg-white/80 backdrop-blur border border-white/60 shadow-md overflow-hidden group min-h-[11rem] flex flex-col justify-center items-center px-5 py-6"
        >
          <Link to={card.to} className="flex flex-col items-center justify-center h-full w-full">
            {card.icon}
            <h3 className="text-lg font-extrabold text-[#6b7547] mb-2 group-hover:text-[#525c32] transition-colors">
              {card.name}
            </h3>
            <p className="text-[#6c7358] font-medium text-sm">{card.desc}</p>
          </Link>
        </div>
      ))}
    </div>
    <Link
      to="/get-involved"
      className="inline-block bg-[#c27d50] text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:shadow-2xl hover:bg-[#a46336] transition-transform transform hover:scale-105 focus-visible:outline-[#c27d50] focus:outline-2 focus:outline-offset-2"
    >
      Join the Team →
    </Link>
  </section>
);

const InfoImpactSection = () => {
  // const location = useLocation();
  // const [showLeaves, setShowLeaves] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileInfoImpactSection infoCards={infoCards} />
      ) : (
        <motion.section
          className="relative py-10 sm:py-16 md:py-24 px-2 sm:px-4 md:px-6 text-center bg-gradient-to-br from-[#f4f3ec] via-[#ebe7d9] to-[#dba979] overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#c27d50] mb-3 sm:mb-6 relative inline-block underline">
            The Movement is Growing 🌿
          </h2>
          <p className="text-[#6c7358] max-w-xs sm:max-w-md md:max-w-xl mx-auto mb-8 sm:mb-12 text-base sm:text-lg font-medium">
            Whether you’re a student, parent, or organization — there’s a place for you in our
            mission to restore and protect the planet.
          </p>

          <div className="w-full max-w-6xl mx-auto h-48 xs:h-56 sm:h-80 md:h-[28rem] mb-10 sm:mb-14 flex items-center justify-center relative">
            <motion.div
              className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 text-center px-2 xs:px-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {infoCards.map((card) => (
                <motion.div
                  key={card.to}
                  variants={fadeUp}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    boxShadow:
                      "0 0 24px 4px rgba(107,117,71,0.13), 0 0 0 2px rgba(107,117,71,0.18), 0 0 60px rgba(107,117,71,0.07), 0 0 120px rgba(107,117,71,0.05)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                  }}
                  className="relative rounded-xl sm:rounded-3xl bg-white/70 sm:bg-white/10 backdrop-blur-md border border-white/60 sm:border-white/40 shadow-lg sm:shadow-[inset_0_0_8px_rgba(107,117,71,0.10),0_2px_16px_0_rgba(107,117,71,0.10)] overflow-hidden group min-h-[12rem] sm:min-h-[16rem] transition-all duration-500 ease-out hover:shadow-[0_0_25px_rgba(107,117,71,0.3)]"
                >
                  <Link to={card.to} className="block p-6 sm:p-10">
                    <div className="flex flex-col items-center justify-center h-full">
                      {card.icon}
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#6b7547] mb-2 sm:mb-3 group-hover:text-[#525c32] transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-[#6c7358] font-medium text-sm sm:text-base">{card.desc}</p>
                    </div>
                    <div className="absolute inset-0 rounded-xl sm:rounded-3xl ring-1 ring-white/40 group-hover:ring-[#c27d50]/30 group-hover:animate-pulse pointer-events-none" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-10 sm:mt-14">
            <Link
              to="/get-involved"
              className="inline-block bg-[#c27d50] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:bg-[#a46336] transition-transform transform hover:scale-105 focus-visible:outline-[#c27d50] focus:outline-2 focus:outline-offset-2"
            >
              Join the Team →
            </Link>
          </div>
        </motion.section>
      )}
    </>
  );
};

export default InfoImpactSection;
