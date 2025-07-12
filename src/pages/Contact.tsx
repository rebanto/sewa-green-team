import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";


const Contact = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh]"
		>
			<div className="relative w-full bg-gradient-to-br from-[#e6f9d5] via-[#f7fbe8] to-[#dbead3] border border-[#cdd1bc] p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center">
				<FaEnvelopeOpenText className="text-[#8a9663] text-7xl mb-4" />
				<h1 className="text-4xl md:text-5xl font-extrabold text-[#8a9663] mb-4 text-center drop-shadow-lg">
					Contact Us
				</h1>
				<p className="text-lg text-[#6b725a] mb-8 text-center max-w-2xl">
					Have a question, partnership idea, or just want to say hi? Fill out the form below and we’ll get back to you soon!
				</p>
				<div className="w-full flex justify-center">
					<div className="w-full max-w-2xl bg-white/90 border border-[#cdd1bc] rounded-xl shadow-lg p-4 md:p-8">
						<iframe
							title="Contact Form"
							src="https://docs.google.com/forms/d/e/1FAIpQLSdVX3BzNiLpZ_J-UodBlZ0dWARLwreyP3l5dsUod_7aSgv-ww/viewform?embedded=true"
							width="100%"
							height="1014"
							frameBorder="0"
							marginHeight={0}
							marginWidth={0}
							className="rounded-lg border border-[#cdd1bc] shadow-md min-h-[600px]"
							style={{ background: "#fff" }}
						>
							Loading…
						</iframe>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
