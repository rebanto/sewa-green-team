import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <h1 className="text-4xl font-bold text-green-700 mb-6">About Us</h1>
      <p className="text-gray-700 mb-4">
        SEWA Green Team is a youth-led branch of SEWA International focused on
        local environmental action. We organize cleanup events, spread
        sustainability awareness, and empower students to protect the planet.
      </p>
      <p className="text-gray-700">
        Our volunteers are from middle and high schools across the Atlanta metro
        area and have collaborated with community organizations, schools, and
        parks to make a measurable difference.
      </p>
    </motion.div>
  );
};

export default About;
