import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Typed from "typed.js"
import { ChevronDown } from "lucide-react"

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-0" />

      {/* Glow Burst */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-[#8a9663]/20 rounded-full blur-[120px] opacity-30 z-0 animate-pulse hidden md:block" />

      {/* Main Content */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        className="relative z-10 text-center px-4 sm:px-6"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 sm:p-10 max-w-[95vw] sm:max-w-3xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-md leading-tight">
            Sewa Green Team
          </h1>
          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-medium text-[#dba979] mb-6 sm:mb-8 h-[32px] sm:h-[40px] select-none cursor-default flex items-center justify-center">
            <span ref={typedRef} />
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/get-involved"
                className="block w-full bg-[#8a9663] hover:bg-[#7a8757] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-white transition duration-300 shadow-md hover:shadow-lg hover:shadow-[#8a9663]/40 focus:outline-none focus:ring-2 focus:ring-[#8a9663]/50 text-base sm:text-lg"
              >
                Volunteer Now →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/initiatives"
                className="block w-full border border-white/30 bg-white/10 hover:bg-white/20 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-semibold backdrop-blur-sm transition shadow-md hover:shadow-lg hover:shadow-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-base sm:text-lg"
              >
                Our Projects →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Chevron */}
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ repeat: Infinity, duration: 1.3 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex items-center justify-center">
          <div className="backdrop-blur-md bg-white/20 rounded-full p-1.5 sm:p-2 border border-white/30 shadow-lg">
            <ChevronDown size={28} className="sm:size-[38px] text-[#dba979] drop-shadow-md transition-transform duration-300 hover:scale-115" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Hero
