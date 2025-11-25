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
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const touchStartTime = useRef(0)
  const currentIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastWheelTimeRef = useRef(0)

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

  // Wheel scroll navigation (solo para ordenador)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Solo activar en ordenador (no en dispositivos táctiles)
      if (isTouchDevice.current) return
      
      // Si hay un modal abierto, no procesar el scroll
      if (isModalOpen()) return
      
      // Si el chat está abierto y el scroll está dentro del chat, no procesar el scroll
      if (isChatOpen() && isScrollInsideChat(e)) return
      
      // Si está en transición, ignorar el scroll
      if (isTransitioningRef.current) return
      
      // Throttling: solo procesar si han pasado al menos 500ms desde el último scroll
      const now = Date.now()
      if (now - lastWheelTimeRef.current < 500) return
      
      // Detectar dirección del scroll
      const deltaY = e.deltaY
      
      // Si el scroll es significativo (más de 30px)
      if (Math.abs(deltaY) > 30) {
        e.preventDefault()
        lastWheelTimeRef.current = now
        
        // Scroll hacia abajo = siguiente slide
        if (deltaY > 0) {
          nextSlide()
        } 
        // Scroll hacia arriba = slide anterior
        else {
          prevSlide()
        }
      }
    }

    const sliderElement = sliderRef.current
    if (sliderElement) {
      sliderElement.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        sliderElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [nextSlide, prevSlide])

  // Touch/swipe support (solo para dispositivos táctiles reales)
  const isTouchDevice = useRef(false)
  const touchStartedOnInteractive = useRef(false)
  
  useEffect(() => {
    // Detectar si es un dispositivo táctil
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  // Verificar si el touch está dentro del área del chat
  const isTouchInsideChat = (target: HTMLElement): boolean => {
    // Verificar si el elemento o alguno de sus ancestros es parte del chat
    return !!(
      target.closest('[class*="chatContainer"]') ||
      target.closest('[class*="modalContent"]') ||
      target.closest('[class*="panelContainer"]') ||
      target.closest('[class*="messagesContainer"]') ||
      target.closest('[class*="inputContainer"]')
    )
  }

  // Verificar si el touch comenzó en un elemento interactivo (excluyendo projectCard para permitir swipes)
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

  // Verificar si el touch está en un projectCard (para manejar taps vs swipes)
  const isProjectCard = (target: EventTarget | null): boolean => {
    if (!target) return false
    const element = target as HTMLElement
    return !!(
      element.closest('[data-interactive="true"]') ||
      element.closest('[class*="projectCard"]') ||
      element.closest('[class*="project-card"]') ||
      element.closest('li[class*="project"]')
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    
    const target = e.target as HTMLElement
    
    // Si el chat está abierto y el touch comenzó dentro del chat, ignorarlo completamente
    if (isChatOpen() && isTouchInsideChat(target)) {
      touchStartedOnInteractive.current = true
      return
    }
    
    // Si el touch comenzó en un elemento interactivo (no projectCard), ignorarlo
    if (isInteractiveElement(e.target)) {
      touchStartedOnInteractive.current = true
      return
    }
    
    // Permitir tracking de touch incluso en projectCard para detectar swipes
    touchStartedOnInteractive.current = false
    e.stopPropagation()
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX // Inicializar también touchEndX
    touchStartY.current = e.touches[0].clientY
    touchEndY.current = e.touches[0].clientY // Inicializar también touchEndY
    touchStartTime.current = Date.now() // Registrar tiempo de inicio
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    if (touchStartedOnInteractive.current) return
    
    e.stopPropagation()
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchDevice.current) return
    
    // Si hay un modal abierto, no procesar eventos táctiles
    if (isModalOpen()) {
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Si el touch comenzó en un elemento interactivo (no projectCard), ignorarlo completamente
    if (touchStartedOnInteractive.current) {
      touchStartedOnInteractive.current = false
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Verificar nuevamente si el touch terminó en un elemento interactivo (no projectCard)
    if (isInteractiveElement(e.target)) {
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Verificar si el touch está en el overlay o modal
    const target = e.target as HTMLElement
    if (
      target.closest('[class*="expandedOverlay"]') ||
      target.closest('[class*="expanded-overlay"]') ||
      target.closest('[class*="expandedCard"]') ||
      target.closest('[class*="expanded-card"]')
    ) {
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    const distanceX = touchEndX.current - touchStartX.current
    const distanceY = touchEndY.current - touchStartY.current
    const isProjectCardElement = isProjectCard(e.target)
    
    // Solo cambiar de slide si el movimiento horizontal es significativamente mayor que el vertical
    // Esto previene que el scroll vertical se interprete como swipe horizontal
    const absDistanceX = Math.abs(distanceX)
    const absDistanceY = Math.abs(distanceY)
    
    // Verificar si el touch está dentro del chat
    if (isChatOpen() && isTouchInsideChat(target)) {
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Verificar si el elemento tiene scroll vertical disponible
    const scrollableElement = target.closest('[class*="slideShell"]') || 
                              target.closest('[class*="slideText"]') ||
                              target.closest('[class*="timeline"]')
    
    let hasVerticalScroll = false
    if (scrollableElement) {
      const element = scrollableElement as HTMLElement
      hasVerticalScroll = element.scrollHeight > element.clientHeight
    }
    
    // Si el elemento tiene scroll vertical y el movimiento vertical es significativo, no cambiar de slide
    if (hasVerticalScroll && absDistanceY > 20) {
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Calcular velocidad del swipe (píxeles por milisegundo)
    const touchDuration = Date.now() - touchStartTime.current
    const swipeVelocity = touchDuration > 0 ? absDistanceX / touchDuration : 0
    
    // Requisitos MUY estrictos para cambiar de slide:
    // 1. Movimiento horizontal mínimo de 120px (aumentado de 80px)
    // 2. El movimiento horizontal debe ser al menos 2.5x mayor que el vertical (aumentado de 1.5x)
    // 3. El movimiento vertical debe ser menor a 60px (nuevo requisito)
    // 4. El swipe debe ser relativamente rápido (más de 0.3 px/ms) para evitar scrolls lentos
    // 5. El swipe debe durar menos de 500ms (nuevo requisito)
    const isHorizontalSwipe = absDistanceX > 120 && 
                              absDistanceX > absDistanceY * 2.5 && 
                              absDistanceY < 60 &&
                              swipeVelocity > 0.3 &&
                              touchDuration < 500
    
    if (isHorizontalSwipe) {
      e.stopPropagation()
      e.preventDefault() // Prevenir que el onClick del projectCard se ejecute
      if (distanceX > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Si es un tap simple (distancia pequeña)
    if (isProjectCardElement) {
      // Si es tap sobre projectCard, NO navegar (dejar que el onClick se ejecute)
      touchStartX.current = 0
      touchEndX.current = 0
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartTime.current = 0
      return
    }
    
    // Si es tap simple en otra área, avanzar a la siguiente slide
    // Solo si el movimiento total es muy pequeño (tap real, no swipe)
    if (absDistanceX < 30 && absDistanceY < 30) {
      e.stopPropagation()
      nextSlide()
    }
    
    touchStartX.current = 0
    touchEndX.current = 0
    touchStartY.current = 0
    touchEndY.current = 0
    touchStartTime.current = 0
  }

  // Verificar si hay un modal abierto
  const isModalOpen = (): boolean => {
    // Verificar si existe un overlay de modal visible
    const overlay = document.querySelector('[class*="expandedOverlay"]') || 
                    document.querySelector('[class*="expanded-overlay"]') ||
                    document.querySelector('[class*="overlay"]')
    if (!overlay) return false
    const style = window.getComputedStyle(overlay)
    return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden'
  }

  // Verificar si el chat está abierto
  const isChatOpen = (): boolean => {
    // Verificar si existe el contenedor del chat visible
    const chatContainer = document.querySelector('[class*="chatContainer"]') ||
                          document.querySelector('[class*="modalContent"]') ||
                          document.querySelector('[class*="panelContainer"]')
    if (!chatContainer) return false
    const style = window.getComputedStyle(chatContainer)
    return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden'
  }

  // Verificar si el scroll está dentro del área del chat
  const isScrollInsideChat = (e: WheelEvent): boolean => {
    const chatContainer = document.querySelector('[class*="chatContainer"]') ||
                          document.querySelector('[class*="modalContent"]') ||
                          document.querySelector('[class*="panelContainer"]')
    if (!chatContainer) return false
    
    const rect = chatContainer.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    // Verificar si el punto del scroll está dentro del área del chat
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  }

  // Manejar clicks en las slides (solo para desktop, en móvil se usa touch)
  const handleSlideClick = (e: React.MouseEvent) => {
    // Si hay un modal abierto, no procesar clicks
    if (isModalOpen()) {
      e.stopPropagation()
      return
    }

    // Solo prevenir si el click NO es en un botón, link u otro elemento interactivo
    const target = e.target as HTMLElement
    const isInteractive = 
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]') ||
      target.closest('[class*="projectCard"]') ||
      target.closest('[class*="project-card"]') ||
      target.closest('li[class*="project"]') ||
      target.closest('[class*="expandedOverlay"]') ||
      target.closest('[class*="expanded-overlay"]') ||
      target.closest('[class*="expandedCard"]') ||
      target.closest('[class*="expanded-card"]')
    
    if (!isInteractive) {
      e.stopPropagation()
      // En desktop, el click también puede avanzar (opcional, según preferencia)
      // Pero en móvil se maneja con touch events
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
