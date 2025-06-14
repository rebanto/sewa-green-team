import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaWater } from "react-icons/fa";

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
    title: "SGT Is Born 🌱",
    description:
      "Founded in late 2022 to make SEWA events more sustainable — like using paper bags at Holi and reusable plates at the 5K.",
  },
  {
    year: "2023",
    title: "Eco-Activism Starts ♻️",
    description:
      "Shifted from just supporting SEWA events to running cleanups and raising awareness about local environmental issues.",
  },
  {
    year: "2024–25",
    title: "Expanding Our Impact 🌊",
    description:
      "River cleanups, education sessions, and more — the Green Team has become a leading student force for sustainability.",
  },
];

const pillars = [
  {
    icon: <FaLeaf className="text-4xl text-green-600 mb-4" />,
    title: "Sustainability First",
    description:
      "From repacking colors to replacing plastic, we always put the planet first in every event and project.",
  },
  {
    icon: <FaRecycle className="text-4xl text-green-600 mb-4" />,
    title: "Community Driven",
    description:
      "We believe change starts local. Our efforts are grassroots — involving schools, parks, and families.",
  },
  {
    icon: <FaWater className="text-4xl text-green-600 mb-4" />,
    title: "Action-Oriented",
    description:
      "We don’t just talk — we host cleanups, educate, and take tangible steps toward a cleaner world.",
  },
];

const About = () => {
  return (
    <div className="overflow-x-hidden">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 py-16 text-center"
      >
        <motion.h1
          className="text-5xl font-extrabold text-green-700 mb-6"
          variants={fadeUp}
        >
          About Us
        </motion.h1>
        <motion.p
          className="text-lg text-gray-700 max-w-2xl mx-auto"
          variants={fadeUp}
          custom={1}
        >
          The SEWA Green Team (SGT) is a student-powered sustainability force, born in 2022 to make community events cleaner, greener, and more impactful.
        </motion.p>
      </motion.section>

      {/* Timeline Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-12">
            How We’ve Grown
          </h2>
          <div className="space-y-12 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200 rounded" />
            {timelineData.map((item, index) => (
              <motion.div
                key={item.year}
                className={`relative w-full md:w-1/2 px-6 py-6 rounded-xl bg-white/30 backdrop-blur-md shadow-lg border border-green-200 transition-all hover:scale-105 ${
                  index % 2 === 0 ? "ml-auto" : "mr-auto"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index + 1}
                variants={fadeUp}
              >
                <h3 className="text-green-600 text-sm font-bold uppercase mb-1">
                  {item.year}
                </h3>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-b from-white to-green-50 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-green-800 mb-12">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="rounded-2xl p-8 bg-white/40 backdrop-blur-md shadow-lg border border-green-200 transition-all hover:scale-105"
              variants={fadeUp}
              custom={index + 1}
            >
              {pillar.icon}
              <h3 className="text-xl font-bold text-green-800 mb-2">
                {pillar.title}
              </h3>
              <p className="text-gray-700">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default About;
