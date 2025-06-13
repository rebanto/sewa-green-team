import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Typed from "typed.js"
import { ChevronDown } from "lucide-react"
import HeroCanvas from "./HeroCanvas"

const Hero = () => {
  const typedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const typed = new Typed(typedRef.current!, {
      strings: [
        "Planting Change 🌱",
        "Powering Youth 🌍",
        "Cleaning Communities 🧹",
        "Leading the Future 💡",
      ],
      typeSpeed: 60,
      backSpeed: 35,
      loop: true,
      showCursor: false,
    })

    return () => typed.destroy()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative min-h-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/hero_bg.jpg')" }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-0" />

      {/* Decorative Glow Burst (optional) */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] opacity-30 z-0 animate-pulse" />

      {/* Main Content */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-10 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 drop-shadow-md leading-tight">
            SEWA Green Team
          </h1>
          <p className="text-2xl sm:text-3xl font-medium text-green-300 mb-8 h-[40px]">
            <span ref={typedRef} />
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/get-involved"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold text-white transition duration-300 shadow-md"
              >
                Volunteer Now →
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/initiatives"
                className="border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-white font-semibold backdrop-blur-sm transition"
              >
                Our Projects →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Chevron */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 text-white z-10"
      >
        <ChevronDown size={32} className="opacity-70" />
      </motion.div>
    </motion.div>
  )
}

export default Hero
