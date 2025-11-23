'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CookieConsentContextType {
  consent: {
    necessary: boolean
    analytics: boolean
    marketing: boolean
  }
  hasConsent: boolean
  showBanner: boolean
  acceptAll: () => void
  rejectAll: () => void
  acceptCustom: (consent: { necessary: boolean; analytics: boolean; marketing: boolean }) => void
  closeBanner: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_BANNER_KEY = 'cookie-banner-shown'

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState({
    necessary: true, // Siempre true, no se puede desactivar
    analytics: false,
    marketing: false,
  })
  const [hasConsent, setHasConsent] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Cargar consentimiento guardado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
      const bannerShown = localStorage.getItem(COOKIE_BANNER_KEY)

      if (savedConsent) {
        try {
          const parsed = JSON.parse(savedConsent)
          setConsent(parsed)
          setHasConsent(true)
          setShowBanner(false)
        } catch (e) {
          // Si hay error, mostrar banner
          setShowBanner(!bannerShown)
        }
      } else {
        // Si no hay consentimiento guardado, mostrar banner
        setShowBanner(!bannerShown)
      }
    }
  }, [])

  const saveConsent = (newConsent: typeof consent) => {
    setConsent(newConsent)
    setHasConsent(true)
    setShowBanner(false)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
      localStorage.setItem(COOKIE_BANNER_KEY, 'true')
    }
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    })
  }

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    })
  }

  const acceptCustom = (newConsent: typeof consent) => {
    saveConsent(newConsent)
  }

  const closeBanner = () => {
    setShowBanner(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_BANNER_KEY, 'true')
    }
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsent,
        showBanner,
        acceptAll,
        rejectAll,
        acceptCustom,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}


