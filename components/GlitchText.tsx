'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './GlitchText.module.css'

interface GlitchTextProps {
  text: string
  className?: string
}

const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const charIndicesRef = useRef<number[]>([])

  useEffect(() => {
    // Limpiar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Inicializar índices aleatorios para cada carácter
    const chars = text.split('')
    charIndicesRef.current = chars.map((char, index) => {
      // Mantener espacios y caracteres especiales
      if (char === ' ' || char === '·' || char === '–' || char === '(' || char === ')' || char === '–' || char === '[' || char === ']') {
        return -1 // -1 significa que no debe cambiar
      }
      return Math.floor(Math.random() * glitchChars.length)
    })

    // Función para rotar caracteres como una máquina de casino
    const rotateChars = () => {
      const newChars = text.split('').map((char, index) => {
        // Mantener espacios y caracteres especiales
        if (char === ' ' || char === '·' || char === '–' || char === '(' || char === ')' || char === '–' || char === '[' || char === ']') {
          return char
        }

        // Rotar el carácter
        if (charIndicesRef.current[index] !== -1) {
          // Incrementar el índice para rotar
          charIndicesRef.current[index] = (charIndicesRef.current[index] + 1) % glitchChars.length
          return glitchChars[charIndicesRef.current[index]]
        }
        return char
      })

      setDisplayText(newChars.join(''))
    }

    // Rotar caracteres cada 100ms para efecto fluido de máquina de casino
    intervalRef.current = setInterval(rotateChars, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text])

  return (
    <span className={`${styles.glitchText} ${className}`} data-text={text}>
      {displayText}
    </span>
  )
}

