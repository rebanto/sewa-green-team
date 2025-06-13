import { motion } from "framer-motion";

const Initiatives = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-6 py-16"
    >
      <h1 className="text-4xl font-bold text-green-700 mb-6">Our Initiatives</h1>
      <ul className="space-y-6">
        <li>
          <h2 className="text-2xl font-semibold">Chattahoochee River Cleanup</h2>
          <p className="text-gray-600">Cleaning up the Jones Bridge corridor and promoting awareness of local watershed health.</p>
        </li>
        <li>
          <h2 className="text-2xl font-semibold">Park & Beach Cleanups</h2>
          <p className="text-gray-600">From Forsyth County to Dekalb, our team helps restore public spaces and ecosystems.</p>
        </li>
        <li>
          <h2 className="text-2xl font-semibold">Adopt-A-Mile Road Program</h2>
          <p className="text-gray-600">Ongoing cleanup and care of a mile of roadway in partnership with SEWA International.</p>
        </li>
      </ul>
    </motion.div>
  )
}

export default Initiatives
