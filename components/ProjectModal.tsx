'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import styles from './ProjectModal.module.css'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    name: string | React.ReactNode
    detail: string
  }
  triggerRect: DOMRect | null
}

export default function ProjectModal({ isOpen, onClose, project, triggerRect }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Calcular posición inicial desde la tarjeta
  const getInitialTransform = () => {
    if (!triggerRect) {
      return {
        scale: 0.8,
        x: '-50%',
        y: '-50%',
        opacity: 0,
      }
    }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const cardCenterX = triggerRect.left + triggerRect.width / 2
    const cardCenterY = triggerRect.top + triggerRect.height / 2
    
    // Calcular el desplazamiento desde el centro de la tarjeta al centro de la pantalla
    // Como usamos top: 50% y left: 50%, necesitamos calcular el offset relativo
    const deltaX = cardCenterX - centerX
    const deltaY = cardCenterY - centerY
    
    // Calcular el scale inicial basado en el tamaño de la tarjeta
    const modalWidth = Math.min(600, window.innerWidth * 0.9)
    const initialScale = Math.min(triggerRect.width / modalWidth, 0.3)

    return {
      scale: initialScale,
      x: `calc(-50% + ${deltaX}px)`,
      y: `calc(-50% + ${deltaY}px)`,
      opacity: 0,
    }
  }

  const initialTransform = getInitialTransform()

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            className={styles.modal}
            initial={initialTransform}
            animate={{
              scale: 1,
              x: '-50%',
              y: '-50%',
              opacity: 1,
            }}
            exit={initialTransform}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35,
              mass: 0.8,
            }}
            style={{
              top: '50%',
              left: '50%',
              originX: 0.5,
              originY: 0.5,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
            <div className={styles.content}>
              <h2 className={styles.title}>{project.name}</h2>
              <p className={styles.detail}>{project.detail}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

