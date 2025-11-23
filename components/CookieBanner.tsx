'use client'

import { useState } from 'react'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, acceptCustom, closeBanner } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [customConsent, setCustomConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  if (!showBanner) return null

  const handleAcceptCustom = () => {
    acceptCustom(customConsent)
  }

  return (
    <div className={styles.bannerOverlay}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h3 className={styles.bannerTitle}>🍪 Uso de Cookies</h3>
          <p className={styles.bannerText}>
            Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido.
            Puedes aceptar todas las cookies, rechazarlas o personalizar tu preferencia.
          </p>

          {showDetails && (
            <div className={styles.details}>
              <div className={styles.cookieType}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={customConsent.necessary}
                    disabled
                    className={styles.checkbox}
                  />
                  <span>
                    <strong>Cookies Necesarias</strong> (Siempre activas)
                    <br />
                    <small>Necesarias para el funcionamiento básico del sitio.</small>
                  </span>
                </label>
              </div>

              <div className={styles.cookieType}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={customConsent.analytics}
                    onChange={(e) =>
                      setCustomConsent({ ...customConsent, analytics: e.target.checked })
                    }
                    className={styles.checkbox}
                  />
                  <span>
                    <strong>Cookies de Análisis</strong>
                    <br />
                    <small>Google Analytics y Hotjar para entender cómo usas el sitio.</small>
                  </span>
                </label>
              </div>

              <div className={styles.cookieType}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={customConsent.marketing}
                    onChange={(e) =>
                      setCustomConsent({ ...customConsent, marketing: e.target.checked })
                    }
                    className={styles.checkbox}
                  />
                  <span>
                    <strong>Cookies de Marketing</strong>
                    <br />
                    <small>Para personalizar anuncios y medir campañas.</small>
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className={styles.bannerActions}>
            <button onClick={rejectAll} className={styles.btnReject}>
              Rechazar todas
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={styles.btnCustom}
            >
              {showDetails ? 'Ocultar detalles' : 'Personalizar'}
            </button>
            {showDetails && (
              <button onClick={handleAcceptCustom} className={styles.btnAcceptCustom}>
                Guardar preferencias
              </button>
            )}
            <button onClick={acceptAll} className={styles.btnAccept}>
              Aceptar todas
            </button>
          </div>

          <button onClick={closeBanner} className={styles.closeBtn} aria-label="Cerrar">
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

