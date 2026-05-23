import { motion } from 'framer-motion'

export function TypingIndicator() {
  const dotVariants = {
    bounce: {
      y: [0, -6, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className="flex w-full justify-start mb-4 px-6 select-none">
      <div className="bg-white text-on-surface border border-border-divider rounded-[16px] rounded-tl-[4px] p-4 flex items-center space-x-1.5 h-11">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            animate="bounce"
            transition={{ delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-text-muted"
          />
        ))}
      </div>
    </div>
  )
}
