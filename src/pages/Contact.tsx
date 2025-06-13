import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 py-16"
    >
      <h1 className="text-4xl font-bold text-green-700 mb-6">Contact Us</h1>
      <p className="mb-4 text-gray-700">
        Have a question or want to collaborate? Reach out to us!
      </p>
      <form className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Name" />
        <input className="w-full p-3 border rounded" placeholder="Email" />
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Message"
          rows={4}
        />
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Send Message
        </button>
      </form>
    </motion.div>
  );
};

export default Contact;
