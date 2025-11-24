'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ChatWidget.module.css'

interface Message {
  id: string
  text: string | React.ReactNode
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  onMessagesChange: (messages: Message[]) => void
}

export default function ChatWidget({ isOpen, onClose, messages, onMessagesChange }: ChatWidgetProps) {
  const isMobile = useIsMobile()
  const { language, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  // Inicializar mensaje de bienvenida solo si no hay mensajes guardados
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: t('chat.welcome'),
        sender: 'ai',
        timestamp: new Date(),
      }
      onMessagesChange([welcomeMessage])
    }
  }, [isOpen, t, messages.length, onMessagesChange])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      // Focus en el input cuando se abre
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, messages])

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

  const [isLoading, setIsLoading] = useState(false)

  // Verificar si se alcanzó el límite de mensajes
  // Contamos solo los mensajes de usuario y asistente (excluyendo el mensaje de bienvenida con id '1')
  const userAndAssistantMessages = messages.filter(
    (msg) => msg.id !== '1' && (msg.sender === 'user' || (msg.sender === 'ai' && typeof msg.text === 'string' && msg.text.trim() !== ''))
  )
  const isLimitReached = userAndAssistantMessages.length >= 30

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isLimitReached) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    const userInput = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // Crear mensaje de IA vacío que se irá actualizando con el streaming
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    }

    // Actualizar el estado con ambos mensajes
    const updatedMessages = [...messages, userMessage, aiMessage]
    onMessagesChange(updatedMessages)

    try {
      // Preparar mensajes para la API (excluyendo el mensaje de bienvenida inicial con id '1')
      // Intercalar mensajes de usuario y asistente en orden cronológico
      const conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }> = []
      const allOrderedMessages = [...messages, userMessage].filter((msg) => msg.id !== '1')
      
      for (const msg of allOrderedMessages) {
        // Solo procesar mensajes con texto string (los ReactNode se ignoran para la API)
        const textContent = typeof msg.text === 'string' ? msg.text : ''
        
        if (msg.sender === 'user') {
          conversationMessages.push({
            role: 'user',
            content: textContent,
          })
        } else if (textContent.trim() !== '') {
          // Solo incluir respuestas de IA que tengan contenido (excluir el mensaje vacío que acabamos de crear)
          conversationMessages.push({
            role: 'assistant',
            content: textContent,
          })
        }
      }

      // Llamar al endpoint de chat con streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      if (!response.ok) {
        // Intentar leer el error como JSON
        let errorData: any = {}
        try {
          const errorText = await response.text()
          if (errorText) {
            errorData = JSON.parse(errorText)
          }
        } catch (e) {
          // Si no se puede parsear, usar el mensaje por defecto
        }
        
        // Si se alcanzó el límite de mensajes
        if (response.status === 429 || errorData.limitReached) {
          const linkedInUrl = 'https://www.linkedin.com/in/arturo-martinez-bellot/'
          const limitMessageContent = errorData.error ? (
            errorData.error
          ) : language === 'es' ? (
            <>
              Espero que hayas disfrutado de mi conversación, pero hasta aquí ha llegado. La he limitado a 30 mensajes, pero si quieres seguir hablando, puedes contactarme directamente dándole al botón de contactar o por{' '}
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                LinkedIn
              </a>
              .
            </>
          ) : (
            <>
              I hope you enjoyed our conversation, but this is where it ends. I've limited it to 30 messages, but if you want to keep talking, you can contact me directly using the contact button or on{' '}
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                LinkedIn
              </a>
              .
            </>
          )
          
          // Reemplazar el mensaje vacío con el mensaje de límite usando el estado actualizado
          onMessagesChange(
            updatedMessages.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: limitMessageContent,
                  }
                : msg
            )
          )
          
          setIsLoading(false)
          setTimeout(() => scrollToBottom(), 100)
          return
        }
        
        throw new Error('Error al obtener respuesta de la IA')
      }

      // Leer el stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No se pudo obtener el stream de respuesta')
      }

      let accumulatedText = ''
      let currentMessages = [...messages, userMessage, aiMessage]

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk

        // Actualizar el mensaje de IA con el texto acumulado
        currentMessages = currentMessages.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: accumulatedText }
            : msg
        )
        onMessagesChange(currentMessages)

        // Scroll automático mientras llegan los chunks
        setTimeout(() => scrollToBottom(), 0)
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      
      // Reemplazar el mensaje vacío con un mensaje de error
      const currentMessages = [...messages, userMessage, aiMessage]
      onMessagesChange(
        currentMessages.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: language === 'es'
                  ? 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
                  : 'Sorry, there was an error processing your message. Please try again.',
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const chatContent = (
    <div className={styles.chatContainer}>
      {/* Cabecera */}
      <div className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>Arturo.AI</h3>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar chat">
          ×
        </button>
      </div>

      {/* Zona de mensajes */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.sender]}`}
          >
            <div className={styles.messageBubble}>
              {typeof message.text === 'string' ? (
                <p className={styles.messageText}>{message.text}</p>
              ) : (
                <div className={styles.messageText}>{message.text}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zona de input */}
      <div className={styles.inputContainer}>
          <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={t('chat.placeholder')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading || isLimitReached}
          aria-label={t('chat.send')}
        >
          {isLoading ? (language === 'es' ? 'Enviando...' : 'Sending...') : t('chat.send')}
        </button>
      </div>
    </div>
  )

  if (!mounted) return null

  if (isMobile) {
    // Modal en mobile/tablet
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <div className={styles.modalWrapper}>
              <motion.div
                className={styles.modalContent}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {chatContent}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )
  }

  // Panel lateral en desktop - también usar portal para aislarlo completamente
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.panelContainer}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {chatContent}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

