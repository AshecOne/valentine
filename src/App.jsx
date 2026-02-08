import { motion } from 'framer-motion'
import { useState } from 'react'

function App() {
  const [hearts, setHearts] = useState([])

  const createHeart = (e) => {
    const heart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    }
    setHearts([...hearts, heart])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id))
    }, 2000)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={createHeart}
    >
      {/* Floating Hearts on Click */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute text-6xl pointer-events-none"
          style={{ left: heart.x, top: heart.y }}
          initial={{ scale: 0, opacity: 1, y: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0],
            y: -200,
          }}
          transition={{ duration: 2 }}
        >
          💖
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <motion.h1
            className="text-7xl md:text-9xl font-bold text-valentine-red mb-8"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            💝
          </motion.h1>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-valentine-pink via-valentine-red to-valentine-rose bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Happy Valentine's Day
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Click anywhere to spread the love! 💕
        </motion.p>

        {/* Floating Hearts Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
