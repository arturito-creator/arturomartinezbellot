'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './TopNav.module.css'

export default function TopNav() {
  const { language, setLanguage } = useLanguage()

  return (
    <nav className={styles.topNav}>
      <div className={styles.logo}>
        ARTURO.<span className={styles.accent}>AI</span>
      </div>
      <div className={styles.menuItems}>
        <div className={styles.langSwitch} role="group" aria-label="Selector de idioma">
          <button
            className={`${styles.langBtn} ${language === 'es' ? styles.active : ''}`}
            onClick={() => setLanguage('es')}
            data-lang="es"
          >
            ES
          </button>
          <button
            className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
            onClick={() => setLanguage('en')}
            data-lang="en"
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  )
}

