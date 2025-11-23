'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    nav: { work: 'Proyectos', contact: 'Contacto' },
    intro: { hello: 'Hola', nameLine: 'mi nombre es', swipeHint: 'desliza →' },
    hotspots: {
      euromon: { title: 'Euromon PLV', description: 'Transformación digital retail', tags: ['Retail', 'Data'] },
      ailab: { title: 'The AI Lab', description: 'Micro-vídeos de IA', tags: ['Contenido', 'Growth'] },
      services: { title: 'Servicios', description: 'Consultoría estratégica', tags: ['Estrategia', 'Growth'] },
      teaching: { title: 'Docencia', description: 'Formación in-company', tags: ['Speaker', 'Workshops'] }
    }
  },
  en: {
    nav: { work: 'Work', contact: 'Contact' },
    intro: { hello: 'Hi', nameLine: 'my name is', swipeHint: 'swipe →' },
    hotspots: {
      euromon: { title: 'Euromon PLV', description: 'Retail digital transformation', tags: ['Retail', 'Data'] },
      ailab: { title: 'The AI Lab', description: 'AI micro-videos', tags: ['Content', 'Growth'] },
      services: { title: 'Services', description: 'Strategic consulting', tags: ['Strategy', 'Growth'] },
      teaching: { title: 'Teaching', description: 'In-company training', tags: ['Speaker', 'Workshops'] }
    }
  }
}

const typingWords = {
  es: [
    'estratega de marketing',
    'consultor de IA',
    'storyteller creativo',
    'growth partner',
    'chief AI evangelist',
    'arquitecto de funnels',
    'brand futurist'
  ],
  en: [
    'marketing strategist',
    'AI consultant',
    'creative storyteller',
    'growth partner',
    'chief AI evangelist',
    'funnel architect',
    'brand futurist'
  ]
}

export const getTypingWords = (lang: Language) => typingWords[lang]

const getNestedTranslation = (lang: Language, path: string): string => {
  return path.split('.').reduce((acc: any, part) => {
    return (acc && typeof acc === 'object') ? acc[part] : undefined
  }, translations[lang]) || ''
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return getNestedTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

