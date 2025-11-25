'use client'

import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Hotspot.module.css'

interface HotspotProps {
  id: string
  data: {
    title: string
    description: string
    tags: string[]
  }
  onClick: () => void
  isLeftSide?: boolean
}

const Hotspot = forwardRef<HTMLDivElement, HotspotProps>(
  ({ id, data, onClick, isLeftSide = false }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <div
        ref={ref}
        className={`${styles.hotspot} ${isLeftSide ? '' : styles.rightSide}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
        }}
        onTouchEnd={(e) => {
          e.stopPropagation()
        }}
        style={{
          position: 'fixed',
          zIndex: 100,
          pointerEvents: 'auto',
          transformOrigin: 'center center',
        }}
      >
        <div className={styles.hotspotDotWrapper}>
          <motion.div
            className={styles.hotspotDot}
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ transformOrigin: 'center center' }}
          >
            <div className={styles.pulseRing}></div>
          </motion.div>
        </div>
        <motion.div
          className={styles.hotspotLine}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            // Crecer desde el punto hacia la tarjeta
            // isLeftSide true: punto a la izquierda, crece desde left
            // isLeftSide false: punto a la derecha (con row-reverse), crece desde right
            transformOrigin: isLeftSide ? 'left center' : 'right center',
          }}
        />
        <motion.div
          className={styles.hotspotCard}
          initial={{ opacity: 0, x: isLeftSide ? 10 : -10, scale: 0.9 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : (isLeftSide ? 10 : -10),
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <div className={styles.tags}>
            {data.tags.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }
)

Hotspot.displayName = 'Hotspot'

export default Hotspot
