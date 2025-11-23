'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { slidesContent, homeSlideLabels } from '@/data/slidesContent'
import Scene3D from './Scene3D'
import SlideContent from './SlideContent'
import styles from './Slider.module.css'

interface SliderProps {
  onHotspotClick?: (modalKey: string) => void
}

export default function Slider({ onHotspotClick }: SliderProps) {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slidesWrapperRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const currentIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)

  const slides = slidesContent[language] || []
  const totalSlides = slides.length + 1 // +1 for home slide
  const indicatorLabels = [
    homeSlideLabels[language] || 'Home',
    ...slides.map((slide) => slide.title),
  ]

  const goToSlide = useCallback(
    (index: number, skipAnimation = false) => {
      // Normalizar el índice
      const normalizedTarget = ((index % totalSlides) + totalSlides) % totalSlides

      if (skipAnimation && slidesWrapperRef.current) {
        slidesWrapperRef.current.style.transition = 'none'
      }

      setCurrentIndex(normalizedTarget)
      currentIndexRef.current = normalizedTarget

      if (skipAnimation && slidesWrapperRef.current) {
        requestAnimationFrame(() => {
          if (slidesWrapperRef.current) {
            slidesWrapperRef.current.style.transition = ''
          }
        })
      }

      setTimeout(() => {
        setIsTransitioning(false)
        isTransitioningRef.current = false
      }, 850)
    },
    [totalSlides]
  )

  const nextSlide = useCallback(() => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    isTransitioningRef.current = true
    const next = (currentIndexRef.current + 1) % totalSlides
    goToSlide(next)
  }, [totalSlides, goToSlide])

  const prevSlide = useCallback(() => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    isTransitioningRef.current = true
    const prev = (currentIndexRef.current - 1 + totalSlides) % totalSlides
    goToSlide(prev)
  }, [totalSlides, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Touch/swipe support (solo para dispositivos táctiles reales)
  const isTouchDevice = useRef(false)
  const touchStartedOnInteractive = useRef(false)
  
  useEffect(() => {
    // Detectar si es un dispositivo táctil
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  // Verificar si el touch comenzó en un elemento interactivo
  const isInteractiveElement = (target: EventTarget | null): boolean => {
    if (!target) return false
    const element = target as HTMLElement
    return !!(
      element.closest('button') ||
      element.closest('a') ||
      element.closest('input') ||
      element.closest('textarea') ||
      element.closest('[role="button"]') ||
      element.closest('[role="link"]') ||
      element.closest(`.${styles.sliderArrow}`) ||
      element.closest(`.${styles.sliderIndicator}`) ||
      element.closest('[class*="hotspot"]') ||
      element.closest('[data-hotspot]')
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    
    // Si el touch comenzó en un elemento interactivo, ignorarlo
    if (isInteractiveElement(e.target)) {
      touchStartedOnInteractive.current = true
      return
    }
    
    touchStartedOnInteractive.current = false
    e.stopPropagation()
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    if (touchStartedOnInteractive.current) return
    
    e.stopPropagation()
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    
    // Si el touch comenzó en un elemento interactivo, ignorarlo completamente
    if (touchStartedOnInteractive.current) {
      touchStartedOnInteractive.current = false
      touchStartX.current = 0
      touchEndX.current = 0
      return
    }
    
    e.stopPropagation()
    const distance = touchEndX.current - touchStartX.current
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Prevenir que clicks en las slides cambien de slide
  const handleSlideClick = (e: React.MouseEvent) => {
    // Solo prevenir si el click NO es en un botón, link u otro elemento interactivo
    const target = e.target as HTMLElement
    const isInteractive = 
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[role="button"]')
    
    if (!isInteractive) {
      e.stopPropagation()
    }
  }

  // Sincronizar refs con el estado
  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  // Update slides when language changes
  useEffect(() => {
    setCurrentIndex(0)
    currentIndexRef.current = 0
    setIsTransitioning(false)
    isTransitioningRef.current = false
  }, [language])

  const normalizedIndex = ((currentIndex % totalSlides) + totalSlides) % totalSlides

  return (
    <div
      className={styles.slider}
      ref={sliderRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          prevSlide()
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          touchStartedOnInteractive.current = true
        }}
        onTouchEnd={(e) => {
          e.stopPropagation()
          touchStartedOnInteractive.current = false
        }}
        aria-label="Slide anterior"
      >
        <svg className={styles.sliderArrowIcon} viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="15 5 7 12 15 19"></polyline>
        </svg>
      </button>

      <div 
        className={styles.slidesWrapper} 
        ref={slidesWrapperRef}
        onClick={handleSlideClick}
      >
        <AnimatePresence mode="wait">
          {normalizedIndex === 0 ? (
            <motion.section
              key="home"
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className={`${styles.slide} ${styles.slideHome}`}
              onClick={handleSlideClick}
            >
              <Scene3D onHotspotClick={onHotspotClick} />
            </motion.section>
          ) : (
            <motion.section
              key={slides[normalizedIndex - 1]?.key || normalizedIndex}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className={styles.slide}
              onClick={handleSlideClick}
            >
              {slides[normalizedIndex - 1] && (
                <SlideContent slide={slides[normalizedIndex - 1]} />
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          nextSlide()
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          touchStartedOnInteractive.current = true
        }}
        onTouchEnd={(e) => {
          e.stopPropagation()
          touchStartedOnInteractive.current = false
        }}
        aria-label="Slide siguiente"
      >
        <svg className={styles.sliderArrowIcon} viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="9 5 17 12 9 19"></polyline>
        </svg>
      </button>

      <div 
        className={`${styles.sliderIndicator} ${normalizedIndex === 0 ? styles.onDarkSlide : ''}`}
        onTouchStart={(e) => {
          if (isInteractiveElement(e.target)) {
            e.stopPropagation()
            touchStartedOnInteractive.current = true
          }
        }}
        onTouchEnd={(e) => {
          if (isInteractiveElement(e.target)) {
            e.stopPropagation()
            touchStartedOnInteractive.current = false
          }
        }}
      >
        {indicatorLabels.map((label, index) => (
          <span
            key={index}
            className={normalizedIndex === index ? styles.active : ''}
            data-label={label}
            onClick={() => goToSlide(index)}
            onTouchStart={(e) => {
              e.stopPropagation()
              touchStartedOnInteractive.current = true
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              touchStartedOnInteractive.current = false
            }}
          />
        ))}
      </div>
    </div>
  )
}
