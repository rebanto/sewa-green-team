import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaWater, FaHeart, FaTree, FaCheckDouble } from "react-icons/fa";
import { supabase } from "~/lib/supabase";
import type { Leader } from "~/types";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
    },
  }),
};

const timelineData = [
  {
    year: "2022",
    title: "SGT Is Born",
    icon: FaHeart,
    description:
      "Founded in late 2022 to make Sewa events more sustainable — like using paper bags at Holi and reusable plates at the 5K.",
  },
  {
    year: "2023",
    title: "Eco-Activism Starts",
    icon: FaTree,
    description:
      "Shifted from just supporting Sewa events to running cleanups and raising awareness about local environmental issues.",
  },
  {
    year: "2024–25",
    title: "Expanding Our Impact",
    icon: FaCheckDouble,
    description:
      "River cleanups, education sessions, and more — the Green Team has become a leading student force for sustainability.",
  },
];

const pillars = [
  {
    icon: <FaLeaf className="text-4xl text-[#8a9663] mb-4" />,
    title: "Sustainability First",
    description:
      "From repacking colors to replacing plastic, we always put the planet first in every event and project.",
  },
  {
    icon: <FaRecycle className="text-4xl text-[#8a9663] mb-4" />,
    title: "Community Driven",
    description:
      "We believe change starts local. Our efforts are grassroots — involving schools, parks, and families.",
  },
  {
    icon: <FaWater className="text-4xl text-[#8a9663] mb-4" />,
    title: "Action-Oriented",
    description:
      "We don’t just talk — we host cleanups, educate, and take tangible steps toward a cleaner world.",
  },
];

const About = () => {
  const [leadership, setLeadership] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadership = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("website_details").select("leadership").single();

      if (error) {
        console.error("Error: ", error);
      }

      if (data && data.leadership) {
        setLeadership((data.leadership as unknown as Leader[]) || []);
      }

      setLoading(false);
    };
    fetchLeadership();
  }, []);

  return (
    <div className="overflow-x-hidden mt-30">
      {/* Intro */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 py-16 text-center"
      >
        <motion.h1 className="text-5xl font-extrabold text-[#6b7547] mb-6" variants={fadeUp}>
          About Us
        </motion.h1>
        <motion.p className="text-lg text-[#858d6a] max-w-2xl mx-auto" variants={fadeUp} custom={1}>
          The Sewa Green Team (SGT) is a student-powered sustainability force, born in 2022 to make
          community events cleaner, greener, and more impactful.
        </motion.p>
      </motion.section>

      {/* Timeline */}
      <section className="bg-[#f8f9f3] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#8a9663] text-center mb-12">How We’ve Grown</h2>
          <div className="space-y-12 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#cdd1bc] rounded" />
            {timelineData.map((item, index) => (
              <motion.div
                key={item.year}
                className={`relative w-full md:w-1/2 px-6 py-6 rounded-xl bg-white/40 backdrop-blur-md shadow-md border border-[#cdd1bc] transition-all hover:scale-105 ${
                  index % 2 === 0 ? "ml-auto -translate-x-5" : "mr-auto translate-x-5"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index + 1}
                variants={fadeUp}
              >
                <h3 className="text-sm font-bold uppercase mb-1 text-[#dba979]">{item.year}</h3>
                <h4 className="text-xl font-semibold mb-2 text-[#8a9663] flex items-center gap-2">
                  {item.title} <item.icon />
                </h4>
                <p className="text-[#858d6a]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-b from-white to-[#f9f9f4] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#8a9663] mb-12">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="rounded-2xl p-8 bg-white/50 backdrop-blur-md shadow-md border border-[#cdd1bc] transition-all hover:scale-105 flex flex-col justify-center"
              variants={fadeUp}
              custom={index + 1}
            >
              <div className="flex justify-center">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-[#8a9663] mb-2">{pillar.title}</h3>
              <p className="text-[#858d6a]">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Leadership Team */}
      <motion.section
        className="py-24 px-6 bg-[#f9f9f4] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#8a9663] mb-12 justify-center place-items-center">
          Meet Our Leadership
        </h2>
        {loading ? (
          <div>Loading leadership...</div>
        ) : leadership.length === 0 ? (
          <div>No leadership roles found.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name + leader.role}
                className="w-72 bg-white/50 backdrop-blur-md border border-[#cdd1bc] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all hover:scale-105"
                variants={fadeUp}
                custom={index + 1}
              >
                <div className="w-28 h-28 rounded-full bg-[#dfe8cb] flex items-center justify-center text-4xl text-[#a2b370] mb-4 overflow-hidden">
                  {leader.image_url ? (
                    <img
                      src={leader.image_url}
                      alt={leader.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>🧑‍💼</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-[#8a9663] mb-1">{leader.role}</h3>
                <p className="text-sm text-[#858d6a] italic">{leader.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default About;
