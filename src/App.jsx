import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import nyanCatAnimation from './assets/nyan-cat.json'
import valentineTitleAnimation from './assets/Happy Valentines Day.json'
import roseAnimation from './assets/Rose.json'

function App() {
  const [nyanPosition, setNyanPosition] = useState({ x: 100, y: 100 })
  const [isChasing, setIsChasing] = useState(false)
  const [flowers, setFlowers] = useState([])
  const [isCaught, setIsCaught] = useState(false)

  // Check if Nyan Cat is stuck at edge and return to center
  useEffect(() => {
    if (isCaught) return // Don't move if caught

    const checkBoundary = () => {
      const edgeThreshold = 100
      const centerX = window.innerWidth / 2 - 75
      const centerY = window.innerHeight / 2 - 75

      const isNearEdge =
        nyanPosition.x < edgeThreshold ||
        nyanPosition.x > window.innerWidth - edgeThreshold - 150 ||
        nyanPosition.y < edgeThreshold ||
        nyanPosition.y > window.innerHeight - edgeThreshold - 150

      if (isNearEdge) {
        // Return to center smoothly
        setNyanPosition({ x: centerX, y: centerY })
      }
    }

    const interval = setInterval(checkBoundary, 2000) // Check every 2 seconds
    return () => clearInterval(interval)
  }, [nyanPosition, isCaught])

  // Make Nyan Cat run away when cursor gets close
  const handleMouseMove = (e) => {
    if (isCaught) return // Stop movement if caught

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const nyanCenterX = nyanPosition.x + 75
    const nyanCenterY = nyanPosition.y + 75

    const dx = mouseX - nyanCenterX
    const dy = mouseY - nyanCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Detection radius - more responsive range
    const detectionRadius = 280

    // If mouse is close, make Nyan Cat run away continuously
    if (distance < detectionRadius) {
      setIsChasing(true)

      // Calculate escape direction (opposite of mouse)
      const angle = Math.atan2(dy, dx) + Math.PI // Add PI to reverse direction

      // More responsive speed calculation
      // Closer = faster, with better minimum speed
      const escapeSpeed = Math.max(25, (detectionRadius - distance) * 0.5)

      // Calculate escape movement
      const escapeX = Math.cos(angle) * escapeSpeed
      const escapeY = Math.sin(angle) * escapeSpeed

      // Calculate new position
      const newX = nyanPosition.x + escapeX
      const newY = nyanPosition.y + escapeY

      // Play area boundaries (margin from screen edges)
      const playAreaMargin = 120
      const minX = playAreaMargin
      const maxX = window.innerWidth - 150 - playAreaMargin
      const minY = playAreaMargin
      const maxY = window.innerHeight - 150 - playAreaMargin

      // Clamp to play area (simple and reliable!)
      const boundedX = Math.max(minX, Math.min(maxX, newX))
      const boundedY = Math.max(minY, Math.min(maxY, newY))

      setNyanPosition({ x: boundedX, y: boundedY })
    } else {
      setIsChasing(false)
    }
  }

  const handleNyanClick = (e) => {
    if (isCaught) return // Already caught

    // Set caught state - trigger victory
    setIsCaught(true)

    // Spawn small flowers at click position
    const flower = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
    }
    setFlowers([...flowers, flower])
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-crosshair"
      style={{
        background: 'linear-gradient(180deg, #001122 0%, #003366 100%)',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Rainbow Background Stripes - stops when caught */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="h-full flex flex-col"
          animate={isCaught ? {} : { x: [0, 50, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {['#FF6666', '#FF9966', '#FFFF66', '#66FF99', '#66FFFF', '#6699FF', '#CC66FF', '#FF66CC'].map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </motion.div>
      </div>

      {/* Pixel Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px #fff',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Small flowers that spawn on catch */}
      {!isCaught && (
        <AnimatePresence>
          {flowers.map(flower => (
            <motion.div
              key={flower.id}
              className="absolute pointer-events-none z-50"
              style={{
                left: flower.x - 50,
                top: flower.y - 50,
                width: '100px',
                height: '100px',
              }}
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1, 0],
                y: [-20, -60],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 3 }}
            >
              <Lottie animationData={roseAnimation} loop={false} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Interactive Nyan Cat - hide when caught */}
      {!isCaught && (
        <motion.div
          className="absolute cursor-pointer z-40"
          animate={{
            x: nyanPosition.x,
            y: nyanPosition.y,
            scale: isChasing ? 1.1 : 1,
            rotate: isChasing ? 5 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 20,
            mass: 0.8,
          }}
          style={{
            width: '150px',
          }}
          onClick={handleNyanClick}
          whileHover={{ scale: 1.1 }}
        >
          <Lottie animationData={nyanCatAnimation} loop={true} />
        </motion.div>
      )}

      {/* Victory Screen - Big Flower */}
      <AnimatePresence>
        {isCaught && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Victory content */}
            <div className="relative z-10 text-center">
              {/* Big Rose */}
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <Lottie
                  animationData={roseAnimation}
                  loop={true}
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(255, 102, 204, 0.8))',
                  }}
                />
              </motion.div>

              {/* Victory Message */}
              <motion.div
                className="font-pixel text-white px-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(18px, 4vw, 32px)',
                    lineHeight: '1.6',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.5), 0 0 20px rgba(255,102,204,0.8)',
                    marginBottom: '16px',
                  }}
                >
                  Inilah hadiah untukmu~
                </h2>
                <p
                  style={{
                    fontSize: 'clamp(12px, 2vw, 16px)',
                    color: '#FF66CC',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                  }}
                >
                  You caught me! 💕
                </p>
              </motion.div>

              {/* Sparkles around rose */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i / 8) * Math.PI * 2) * 150],
                    y: [0, Math.sin((i / 8) * Math.PI * 2) * 150],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - hide when caught */}
      {!isCaught && (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 pointer-events-none">
          <div className="text-center max-w-4xl">
            {/* Happy Valentine's Day Lottie */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="w-full max-w-md mx-auto">
                <Lottie
                  animationData={valentineTitleAnimation}
                  loop={true}
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 102, 204, 0.6))',
                  }}
                />
              </div>
            </motion.div>

            {/* Kawaii Message */}
            <motion.p
              className="font-pixel mb-6"
              style={{
                fontSize: 'clamp(12px, 2.5vw, 18px)',
                lineHeight: '1.8',
                color: '#FF66CC',
                textShadow: '2px 2px 0px rgba(0,0,0,0.5), 0 0 10px rgba(255,102,204,0.5)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Catch me to get flowers~ 💕
            </motion.p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
