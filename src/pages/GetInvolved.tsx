import { motion } from "framer-motion";

const GetInvolved = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-6 py-20"
    >
      <h1 className="text-5xl font-extrabold text-[#8a9663] mb-6 text-center">
        Get Involved
      </h1>
      <p className="text-lg text-[#6b725a] text-center mb-10 max-w-xl mx-auto">
        Join the movement! Fill out the form below to volunteer with the Sewa Green Team and be a part of our environmental impact.
      </p>
      <form className="space-y-5 bg-white/80 border border-[#cdd1bc] p-8 rounded-xl shadow-md backdrop-blur-sm">
        <input
          className="w-full p-3 rounded-lg border border-[#cdd1bc] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Full Name"
          type="text"
          required
        />
        <input
          className="w-full p-3 rounded-lg border border-[#cdd1bc] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Email Address"
          type="email"
          required
        />
        <textarea
          className="w-full p-3 rounded-lg border border-[#cdd1bc] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Why do you want to volunteer?"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-[#8a9663] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#73814f] transition duration-300 shadow-md hover:shadow-lg"
        >
          Submit Application →
        </button>
      </form>
    </motion.div>
  );
};

export default GetInvolved;
