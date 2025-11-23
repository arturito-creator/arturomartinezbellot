'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './Modal.module.css'

interface ModalProps {
  activeModal: string | null
  onClose: () => void
}

interface ModalContent {
  title: string
  subtitle?: string
  paragraphs?: string[]
  statsGroups?: Array<Array<{ value: string; label: string }>>
  note?: string
  socialLinks?: Array<{
    icon: string
    url: string
    label: string
  }>
}

const modalData: Record<'es' | 'en', Record<string, ModalContent>> = {
  es: {
    euromon: {
      title: 'Euromon PLV',
      subtitle: 'Revolucionando el punto de venta con IA.',
      statsGroups: [
        [
          { value: '+45%', label: 'Engagement' },
          { value: '80M+', label: 'Data points' },
        ],
      ],
      paragraphs: [
        'Implementación de algoritmos de visión por computador para analizar el comportamiento del consumidor en tiempo real dentro de espacios físicos, optimizando la disposición de productos.',
      ],
    },
    ailab: {
      title: 'The AI Lab',
      subtitle: 'Storytelling en IA Generativa.',
      statsGroups: [
        [
          { value: '100+', label: 'Vídeos cortos' },
          { value: '160K+', label: 'Seguidores' },
        ],
        [
          { value: '2.5M+', label: 'Likes' },
          { value: '200M+', label: 'Views' },
        ],
      ],
      paragraphs: [
        'En The AI Lab comenzamos compartiendo en TikTok e Instagram hacks reales sobre cómo aprovechar la IA generativa en el día a día. Fue una experiencia que me hizo aprender muchísimo sobre cómo analizar y optimizar contenido en redes: pulir los primeros segundos para mejorar retención, probar distintos hooks y formatos, y tomar decisiones basadas en métricas como watch time, compartidos e interacción.',
      ],
      note: 'Dato interesante: nuestro mejor vídeo llegó a más de 46M de views.',
      socialLinks: [
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/theofficialailab',
          label: '@theofficialailab',
        },
        {
          icon: 'tiktok',
          url: 'https://www.tiktok.com/@theofficialailab',
          label: '@theofficialailab',
        },
      ],
    },
    services: {
      title: 'Servicios',
      subtitle: 'Consultoría estratégica & despliegues de IA.',
      paragraphs: [
        'Diseño roadmaps de IA y growth alineados con objetivos de negocio, construyendo quick wins que desbloquean inversión y confianza.',
        'Trabajo junto a equipos directivos para activar casos de uso medibles: desde automatización de funnels hasta copilotos internos.',
      ],
    },
    teaching: {
      title: 'Docencia',
      subtitle: 'Formación aplicada para equipos.',
      paragraphs: [
        'Diseño workshops a medida para marketing, innovación y liderazgo, enfocándome en aterrizar IA generativa en flujos reales.',
        'Mi objetivo es que cada sesión termine con frameworks accionables y playbooks listos para usar al día siguiente.',
      ],
    },
  },
  en: {
    euromon: {
      title: 'Euromon PLV',
      subtitle: 'Reimagining retail touchpoints with AI.',
      statsGroups: [
        [
          { value: '+45%', label: 'Engagement' },
          { value: '80M+', label: 'Data points' },
        ],
      ],
      paragraphs: [
        'We deployed computer vision models to analyse shopper behavior in real time inside physical stores, optimising product placement and in-store storytelling.',
      ],
    },
    ailab: {
      title: 'The AI Lab',
      subtitle: 'Generative AI storytelling.',
      statsGroups: [
        [
          { value: '100+', label: 'Short-form videos' },
          { value: '160K+', label: 'Followers' },
        ],
        [
          { value: '2.5M+', label: 'Likes' },
          { value: '200M+', label: 'Views' },
        ],
      ],
      paragraphs: [
        'We started by sharing practical generative AI hacks on TikTok and Instagram. That journey taught me to fine-tune hooks, iterate formats fast and make creative decisions grounded in watch time, shares and retention.',
      ],
      note: 'Fun fact: our best-performing video surpassed 46M views.',
      socialLinks: [
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/theofficialailab',
          label: '@theofficialailab',
        },
        {
          icon: 'tiktok',
          url: 'https://www.tiktok.com/@theofficialailab',
          label: '@theofficialailab',
        },
      ],
    },
    services: {
      title: 'Services',
      subtitle: 'Strategic consulting & AI activation.',
      paragraphs: [
        'I build AI and growth roadmaps aligned with business goals, prioritising quick wins that unlock investment and internal buy-in.',
        'From funnel automation to internal copilots, I partner with leadership teams to launch measurable use cases.',
      ],
    },
    teaching: {
      title: 'Teaching',
      subtitle: 'Applied learning for teams.',
      paragraphs: [
        'I craft bespoke workshops for marketing, innovation and leadership teams, grounding generative AI in real workflows.',
        'Every session ends with actionable frameworks and plug-and-play playbooks for immediate adoption.',
      ],
    },
  },
}

export default function Modal({ activeModal, onClose }: ModalProps) {
  const { language } = useLanguage()

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModal])

  const content: ModalContent | null = activeModal
    ? modalData[language]?.[activeModal] || null
    : null

  return (
    <AnimatePresence>
      {activeModal && content && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={{ opacity: 1, visibility: 'visible' }}
          exit={{ opacity: 0, visibility: 'hidden' }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.stopPropagation()
          }}
        >
          <motion.div
            className={styles.modalPanel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closeModal} 
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onClose()
              }}
            >
              &times;
            </button>
            <div className={styles.modalContent}>
              <h2>{content.title}</h2>
              {content.subtitle && (
                <p className={styles.subtitle}>{content.subtitle}</p>
              )}
              {content.statsGroups && (
                <div className={styles.statsContainer}>
                  {content.statsGroups.map((group, i) => (
                    <div key={i} className={styles.statsGrid}>
                      {group.map((stat, j) => (
                        <div key={j} className={styles.stat}>
                          <strong>{stat.value}</strong>
                          <small>{stat.label}</small>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {content.paragraphs?.map((para, i) => (
                <p key={i} className={styles.bodyText}>
                  {para}
                </p>
              ))}
              {content.note && (
                <p className={`${styles.bodyText} ${styles.note}`}>
                  <em>{content.note}</em>
                </p>
              )}
              {content.socialLinks && (
                <div className={styles.socialLinks}>
                  {content.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      className={styles.socialLink}
                    >
                      <span className={`${styles.socialIcon} ${styles[link.icon]}`}></span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

