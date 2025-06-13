import { useEffect, useState } from 'react'

interface StatProps {
  label: string
  end: number
}

const Stat = ({ label, end }: StatProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const increment = Math.ceil(end / 50)
    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment
        if (next >= end) {
          clearInterval(interval)
          return end
        }
        return next
      })
    }, 30)
    return () => clearInterval(interval)
  }, [end])

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-green-600">{count}+</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

const StatsCounter = () => {
  const stats = [
    { label: 'Volunteers', end: 200 },
    { label: 'Trash Removed (lbs)', end: 5000 },
    { label: 'Events Hosted', end: 25 },
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
      {stats.map((stat) => (
        <Stat key={stat.label} label={stat.label} end={stat.end} />
      ))}
    </div>
  )
}

export default StatsCounter
