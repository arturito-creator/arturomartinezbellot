'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLanguage, getTypingWords } from '@/contexts/LanguageContext'
import TypingText from './TypingText'
import Hotspot from './Hotspot'
import { useHotspotPhysics } from '@/hooks/useHotspotPhysics'
import ChatWidget from './ChatWidget'
import { TextShimmer } from './TextShimmer'
import styles from './Scene3D.module.css'

interface Scene3DProps {
  onHotspotClick?: (modalKey: string) => void
}

const hotspotPositions = [
  { id: 'h-1', target: 'modal-euromon', isLeftSide: true },
  { id: 'h-2', target: 'modal-ailab', isLeftSide: true },
  { id: 'h-3', target: 'modal-services', isLeftSide: false },
  { id: 'h-4', target: 'modal-teaching', isLeftSide: false },
]

// Array de imágenes disponibles
const arturoImages = [
  '/Arturo_NB.png',
  '/Arturo_NB2.png',
  '/Arturo_NB3.png',
  '/Arturo_NB4.png',
]

// Función para seleccionar una imagen aleatoria
const getRandomImage = () => {
  return arturoImages[Math.floor(Math.random() * arturoImages.length)]
}

export default function Scene3D({ onHotspotClick }: Scene3DProps) {
  const { language, t } = useLanguage()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 })
  // Usar la primera imagen por defecto para evitar hydration mismatch
  const [selectedImage, setSelectedImage] = useState(arturoImages[0])
  const [isMounted, setIsMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  // Estado del chat persistente
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string
    text: string | React.ReactNode
    sender: 'user' | 'ai'
    timestamp: Date
  }>>([])
  
  // Cargar mensajes del chat desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('arturo-ai-chat-messages')
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          // Convertir timestamps de string a Date
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          setChatMessages(messagesWithDates)
        } catch (error) {
          console.error('Error al cargar mensajes del chat:', error)
        }
      }
    }
  }, [])
  
  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== 'undefined' && chatMessages.length > 0) {
      localStorage.setItem('arturo-ai-chat-messages', JSON.stringify(chatMessages))
    }
  }, [chatMessages])
  
  // Cambiar a una imagen aleatoria solo en el cliente después de la hidratación
  useEffect(() => {
    setIsMounted(true)
    setSelectedImage(getRandomImage())
  }, [])
  
  // Crear refs para cada hotspot
  const hotspotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [hotspotElements, setHotspotElements] = useState<HTMLElement[]>([])

  // Usar el hook de física de partículas
  useHotspotPhysics(sceneRef, hotspotElements)

  // Sincronizar elementos DOM de hotspots cuando las refs estén disponibles
  useEffect(() => {
    // Función para verificar y actualizar elementos
    const checkElements = () => {
      const elements = hotspotRefs.current.filter((ref): ref is HTMLDivElement => ref !== null)
      if (elements.length === hotspotPositions.length) {
        // Solo actualizar si los elementos realmente cambiaron
        const currentElements = hotspotElements
        const hasChanged = elements.length !== currentElements.length || 
          elements.some((el, i) => el !== currentElements[i])
        
        if (hasChanged) {
          setHotspotElements(elements)
        }
        return true
      }
      return false
    }
    
    // Verificar inmediatamente
    checkElements()
    
    // Si no están todos disponibles, verificar periódicamente (solo unas pocas veces)
    let attempts = 0
    const maxAttempts = 20 // Máximo 20 intentos (1 segundo)
    const intervalId = setInterval(() => {
      attempts++
      if (checkElements() || attempts >= maxAttempts) {
        clearInterval(intervalId)
      }
    }, 50)
    
    return () => {
      clearInterval(intervalId)
    }
  }, []) // Solo ejecutar una vez al montar

  useEffect(() => {
    const prefersPointerTilt = window.matchMedia('(pointer: fine) and (hover: hover)')
    if (!prefersPointerTilt.matches || !wrapperRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      setTilt({
        rotateX: -((e.clientY - centerY) / centerY) * 3,
        rotateY: ((e.clientX - centerX) / centerX) * 3,
        shiftX: ((e.clientX - centerX) / centerX) * 12,
        shiftY: ((e.clientY - centerY) / centerY) * 8,
      })
    }

    const handleMouseLeave = () => {
      setTilt({ rotateX: 0, rotateY: 0, shiftX: 0, shiftY: 0 })
    }

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const modalTargetMap: Record<string, string> = {
    'modal-euromon': 'euromon',
    'modal-ailab': 'ailab',
    'modal-services': 'services',
    'modal-teaching': 'teaching',
  }

  const openChatWidget = () => {
    setIsChatOpen(true)
  }

  const closeChatWidget = () => {
    setIsChatOpen(false)
  }

  return (
    <main className={styles.scene} id="scene" ref={sceneRef}>
      <section className={styles.introCopy}>
        <p className={styles.introLine}>
          <span>{t('intro.hello')}</span>
          <TypingText words={getTypingWords(language)} />
          <span className={styles.typingCursor}>|</span>,
        </p>
        <p className={styles.introLine}>
          <span>{t('intro.nameLine')}</span>
          <strong>Arturo Martínez</strong>
        </p>
        <button 
          className={styles.chatButton}
          onClick={openChatWidget}
          disabled={isChatOpen}
        >
          {isChatOpen ? (
            <TextShimmer duration={1.5} spread={10}>
              {t('intro.chatting')}
            </TextShimmer>
          ) : (
            t('intro.chatButton')
          )}
        </button>
        <p className={styles.swipeHint} aria-hidden="true">
          {t('intro.swipeHint')}
        </p>
      </section>

      <div
        ref={wrapperRef}
        className={styles.characterWrapper}
        style={{
          transform: `translate3d(${tilt.shiftX}px, ${tilt.shiftY}px, 0) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        }}
      >
        <div className={styles.characterImgBox}>
          <Image
            src={selectedImage}
            alt="Arturo Portrait"
            fill
            className={styles.mainPhoto}
            priority
            sizes="100vw"
          />
          <div className={styles.techOverlay}></div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={closeChatWidget}
        messages={chatMessages}
        onMessagesChange={setChatMessages}
      />

      {/* Hotspots fuera del contexto 3D para que no se vean afectados por el tilt */}
      {hotspotPositions.map((pos, index) => {
        const modalKey = modalTargetMap[pos.target] || ''
        const hotspotData = {
          title: t(`hotspots.${modalKey}.title`),
          description: t(`hotspots.${modalKey}.description`),
          tags: [
            t(`hotspots.${modalKey}.tags.0`),
            t(`hotspots.${modalKey}.tags.1`),
          ],
        }

        return (
          <Hotspot
            key={pos.id}
            ref={(el) => {
              hotspotRefs.current[index] = el
            }}
            id={pos.id}
            data={hotspotData}
            isLeftSide={pos.isLeftSide}
            onClick={() => onHotspotClick?.(modalKey)}
          />
        )
      })}
    </main>
  )
}

