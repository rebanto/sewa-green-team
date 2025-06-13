import Hero from "../components/Hero"
import StatsCounter from "../components/StatsCounter"
import FeaturedEvent from "../components/FeaturedEvent"
import GreenLottie from "../components/GreenLottie"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Hero />

      {/* Mission + Stats */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-green-700">Together, We’re Growing a Greener Future 🌍</h2>
        <p className="text-gray-700 mb-8 text-lg">
          SEWA Green Team is a youth-powered environmental force reshaping communities through cleanups, awareness, and action.
        </p>
        <StatsCounter />
      </section>

      {/* Featured Event Section */}
      <section className="bg-green-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">🌱 Recent Impact</h2>
          <p className="text-gray-600 mb-8">
            Explore what we've been up to. These aren’t just events — they’re movements.
          </p>
          <FeaturedEvent />
          <Link
            to="/initiatives"
            className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            See All Initiatives →
          </Link>
        </div>
      </section>

      {/* Visual Animation + Call to Action */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">The Movement is Growing 🌿</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-10">
          Whether you’re a student, parent, or organization — there’s a role for you to play in protecting our planet.
        </p>
        <GreenLottie />
        <Link
          to="/get-involved"
          className="mt-8 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
        >
          Join the Team →
        </Link>
      </section>

      {/* CTA Grid to Drive Clicks */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <Link
            to="/about"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition border-t-4 border-green-500"
          >
            <h3 className="text-xl font-bold text-green-700 mb-2">Who We Are</h3>
            <p className="text-gray-600">Learn about our mission, team, and values.</p>
          </Link>
          <Link
            to="/initiatives"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition border-t-4 border-green-500"
          >
            <h3 className="text-xl font-bold text-green-700 mb-2">What We Do</h3>
            <p className="text-gray-600">Explore our cleanups and sustainability programs.</p>
          </Link>
          <Link
            to="/contact"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition border-t-4 border-green-500"
          >
            <h3 className="text-xl font-bold text-green-700 mb-2">Partner With Us</h3>
            <p className="text-gray-600">Want to collaborate? Let’s make it happen.</p>
          </Link>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
