import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { FaTree, FaWater, FaRoad } from 'react-icons/fa';

const initiatives = [
  {
    title: 'Chattahoochee River Cleanup',
    description:
      "Our flagship cleanup effort along the Jones Bridge corridor—protecting water quality, preserving native ecosystems, and raising awareness about Georgia's most vital watershed.",
    icon: <FaWater className="text-[#6ca0dc] text-3xl" />, // River blue
    image: '/hero_bg.jpg',
  },
  {
    title: 'Park & Beach Cleanups',
    description:
      'Across counties like Forsyth, Dekalb, and Fulton, our youth volunteers restore degraded parks, lakeshores, and trails—one bag of trash at a time.',
    icon: <FaTree className="text-[#8a9663] text-3xl" />, // Earthy olive
    image: '/hero_bg.jpg',
  },
  {
    title: 'Adopt-A-Mile Road Program',
    description:
      'In partnership with Sewa International, we’ve taken full responsibility for a local roadway—ensuring it stays clean and green through regular maintenance drives.',
    icon: <FaRoad className="text-[#dba979] text-3xl" />,
    image: '/hero_bg.jpg',
  },
];

export default function Initiatives() {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-[#ebe7d9] to-[#e2c5a9] px-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto text-center"
      >
        <h1 className="text-5xl font-extrabold text-[#8a9663] mb-6">
          Our Initiatives
        </h1>
        <p className="text-lg text-[#858d6a] max-w-3xl mx-auto mb-16">
          Every initiative we take is an opportunity to give back to our planet.
          These efforts aren’t just projects—they’re movements driven by passion,
          responsibility, and youth-led energy.
        </p>

        <div className="flex flex-col space-y-16 pb-10">
          {initiatives.map((item, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Tilt
                tiltMaxAngleX={3}
                tiltMaxAngleY={3}
                glareEnable={true}
                glareMaxOpacity={0.15}
                scale={1.01}
                className="rounded-xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm border border-[#cdd1bc] hover:shadow-2xl transform-gpu transition-all duration-500 md:max-h-[22rem] md:min-h-[16rem] max-w-3xl mx-auto"
              >
                <div className="md:flex md:min-h-[16rem] min-h-[14rem]">
                  {/* Image */}
                  <div className="md:w-1/2 w-full h-56 md:h-auto min-h-[14rem]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover min-h-[14rem]"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 p-8 text-left flex flex-col justify-center min-h-[14rem]">
                    <div className="flex items-center gap-4 mb-4">
                      {item.icon}
                      <h2 className="text-2xl font-bold text-[#6f774d]">
                        {item.title}
                      </h2>
                    </div>
                    <p className="text-[#6d7260] text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
