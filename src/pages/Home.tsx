import Hero from "../components/Hero"
import StatsCounter from "../components/StatsCounter"
import FeaturedEvent from "../components/FeaturedEvent"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import InfoImpactSection from "../components/InfoImpactSection"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }, // Remove 'ease' for compatibility
  },
}

const Home = () => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
    >
      <Hero />

      {/* Mission + Stats */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-20 text-center"
        variants={fadeUp}
      >
        <h2 className="text-4xl font-extrabold mb-6 text-green-700 leading-tight">
          Together, We’re Growing a Greener Future 🌍
        </h2>
        <p className="text-gray-700 mb-10 text-lg max-w-3xl mx-auto">
          Sewa Green Team is a youth-powered environmental force reshaping communities through cleanups, education, and green action.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to="/about"
            className="inline-block bg-green-100 text-green-800 font-semibold px-6 py-3 rounded-full border border-green-300 hover:bg-green-200 hover:text-green-900 transition shadow-sm"
          >
            Learn More About Us
          </Link>
        </div>
        <StatsCounter volunteers={150} trash={3200} events={24} />
      </motion.section>

      {/* Featured Event Section */}
      <motion.section
        className="bg-green-50 py-20 px-6"
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">🌱 Recent Impact</h2>
          <p className="text-gray-600 mb-8">
            These aren’t just events — they’re movements creating lasting change.
          </p>
          <FeaturedEvent />
          <Link
            to="/initiatives"
            className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition shadow-lg hover:scale-105"
          >
            See All Initiatives →
          </Link>
        </div>
      </motion.section>

      <InfoImpactSection />
      
    </motion.div>
  )
}

export default Home
