'use client'

import { useState, useEffect } from 'react'

interface TypingTextProps {
  words: string[]
}

export default function TypingText({ words }: TypingTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (words.length === 0) return

    const currentWord = words[wordIndex] || ''
    const typeSpeed = 110
    const deleteSpeed = 70
    const holdDelay = 1700

    let timeoutId: NodeJS.Timeout

    if (!isDeleting && charIndex < currentWord.length) {
      timeoutId = setTimeout(() => {
        setCharIndex(charIndex + 1)
        setDisplayText(currentWord.slice(0, charIndex + 1))
      }, typeSpeed)
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true)
      }, holdDelay)
    } else if (isDeleting && charIndex > 0) {
      timeoutId = setTimeout(() => {
        setCharIndex(charIndex - 1)
        setDisplayText(currentWord.slice(0, charIndex - 1))
      }, deleteSpeed)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex((wordIndex + 1) % words.length)
      setCharIndex(0)
      setDisplayText('')
      timeoutId = setTimeout(() => {}, 400)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [words, wordIndex, charIndex, isDeleting])

  return <span className="changing-word">{displayText}</span>
}

