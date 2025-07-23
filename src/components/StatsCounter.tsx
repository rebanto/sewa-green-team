import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWebsiteStats } from "../hooks/useWebsiteStats";

interface StatProps {
  label: string;
  end: number;
  suffix?: string;
}

const Stat = ({ label, end, suffix = "+" }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1.5; // seconds
    const frames = duration * 60;
    const increment = end / frames;
    let frame = 0;

    const id = requestAnimationFrame(function countUp() {
      frame++;
      const current = Math.min(end, Math.floor(increment * frame));
      setCount(current);
      if (frame < frames) {
        requestAnimationFrame(countUp);
      }
    });

    return () => cancelAnimationFrame(id);
  }, [end]);

  return (
    <div className="text-center p-4">
      <motion.div
        className="text-5xl font-extrabold text-[#8a9663]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {count}
        <span className="text-[#dba979]">{suffix}</span>
      </motion.div>
      <div className="mt-2 text-[#858d6a] text-lg">{label}</div>
    </div>
  );
};

const StatsCounter = () => {
  const { stats, loading } = useWebsiteStats();

  const statsArr = [
    { label: "Volunteers", end: stats.volunteers },
    { label: "Trash Removed (lbs)", end: stats.trash },
    { label: "Events Hosted", end: stats.events },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 bg-[#fdfdfb] rounded-xl shadow-lg border border-[#e8e8e0] px-3 sm:px-0">
      {loading ? (
        <div className="col-span-3 text-center text-gray-500">Loading stats...</div>
      ) : (
        statsArr.map((stat, i) => <Stat key={i} {...stat} />)
      )}
    </div>
  );
};

export default StatsCounter;
