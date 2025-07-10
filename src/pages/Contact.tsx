import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";

const Contact = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]"
		>
			<div className="relative w-full bg-gradient-to-br from-[#e6f9d5] via-[#f7fbe8] to-[#dbead3] border border-[#cdd1bc] p-10 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center">
				<FaEnvelopeOpenText className="text-[#8a9663] text-7xl mb-4" />
				<h1 className="text-5xl font-extrabold text-[#8a9663] mb-4 text-center drop-shadow-lg">
					Contact Us
				</h1>
				<p className="text-lg text-[#6b725a] mb-6 text-center max-w-xl">
					Have a question, partnership idea, or just want to say hi?{" "}
					<br />
					We’d love to hear from you.
				</p>
				<div className="bg-white/90 border border-[#cdd1bc] rounded-xl shadow-lg px-8 py-6 flex flex-col items-center">
					<p className="text-xl font-semibold text-[#8a9663] mb-2 text-center">
						Email us at:
					</p>
					<a
						href="mailto:sewagreenteamatl@gmail.com"
						className="text-2xl font-bold text-[#6b725a] underline underline-offset-4 hover:text-[#8a9663] transition-colors duration-200 mb-2"
					>
						sewagreenteamatl@gmail.com
					</a>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
