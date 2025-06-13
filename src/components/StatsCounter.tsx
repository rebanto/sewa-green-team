import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StatProps {
  label: string
  end: number
  suffix?: string
}

const Stat = ({ label, end, suffix = '+' }: StatProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1.5 // seconds
    const frames = duration * 60
    const increment = end / frames
    let frame = 0

    const id = requestAnimationFrame(function countUp() {
      frame++
      const current = Math.min(end, Math.floor(increment * frame))
      setCount(current)
      if (frame < frames) {
        requestAnimationFrame(countUp)
      }
    })

    return () => cancelAnimationFrame(id)
  }, [end])

  return (
    <div className="text-center p-4">
      <motion.div
        className="text-5xl font-extrabold text-green-600"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {count}
        <span className="text-green-400">{suffix}</span>
      </motion.div>
      <div className="mt-2 text-gray-600 text-lg">{label}</div>
    </div>
  )
}

const StatsCounter = ({ volunteers, trash, events }: { volunteers: number; trash: number; events: number }) => {
  const stats = [
    { label: 'Volunteers', end: volunteers },
    { label: 'Trash Removed (lbs)', end: trash },
    { label: 'Events Hosted', end: events },
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 bg-white rounded-xl shadow-lg">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.3, duration: 0.6 }}
        >
          <Stat {...stat} />
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCounter
