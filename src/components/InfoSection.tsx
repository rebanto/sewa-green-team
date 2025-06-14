import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHandsHelping, FaGlobeAmericas } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const infoCards = [
  {
    name: 'Who We Are',
    desc: 'Learn about our mission, team, and values.',
    to: '/about',
    icon: <FaLeaf className="text-3xl text-green-600 mb-4" />,
  },
  {
    name: 'What We Do',
    desc: 'Explore our cleanups and sustainability programs.',
    to: '/initiatives',
    icon: <FaGlobeAmericas className="text-3xl text-green-600 mb-4" />,
  },
  {
    name: 'Partner With Us',
    desc: 'Want to collaborate? Let’s make it happen.',
    to: '/contact',
    icon: <FaHandsHelping className="text-3xl text-green-600 mb-4" />,
  },
];

const InfoSection = () => {
  return (
    <motion.section
      className="relative bg-gradient-to-br from-green-50 via-gray-100 to-white py-24 px-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {infoCards.map((card, idx) => (
          <motion.div
            key={card.to}
            variants={fadeUp}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="rounded-2xl backdrop-blur-sm bg-white/70 border border-green-200 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
          >
            <Link to={card.to} className="block p-8">
              <div className="flex flex-col items-center justify-center h-full">
                {card.icon}
                <h3 className="text-xl font-extrabold text-green-800 mb-2 group-hover:text-green-900 transition-colors">
                  {card.name}
                </h3>
                <p className="text-gray-700 font-medium">{card.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default InfoSection;
