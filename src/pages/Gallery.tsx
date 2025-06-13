import { motion } from 'framer-motion'
import { useState } from 'react'

const images = [
  '/photos/event1.jpg',
  '/photos/event2.jpg',
  '/photos/event3.jpg',
]

const Gallery = () => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-6 py-16"
    >
      <h1 className="text-4xl font-bold text-green-700 mb-8">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <img
            key={img}
            src={img}
            alt=""
            className="rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
            onClick={() => setSelected(img)}
          />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="" className="max-w-[90%] max-h-[90%] rounded-lg" />
        </div>
      )}
    </motion.div>
  )
}

export default Gallery
