import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function XPPopup({ xp, show, onDone }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onDone(), 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg px-6 py-3 rounded-full shadow-2xl shadow-yellow-500/50 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>+{xp} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
