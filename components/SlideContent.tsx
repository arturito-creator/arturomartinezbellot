'use client'

import { useState, useRef, useEffect, useRef as useRefHook } from 'react'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Slide } from '@/data/slidesContent'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './SlideContent.module.css'

// Importar el contenido de los modales
const modalData: Record<'es' | 'en', Record<string, any>> = {
  es: {
    euromon: {
      title: 'Euromon PLV',
      subtitle: 'Marketing Specialist (2023–hoy)',
      highlights: [
        'Diseño y desarrollo de la web (UI/UX) + Posicionamiento Web (SEO): Multiplicando x5 el tráfico orgánico respecto a antes de mi incorporación',
        'Gestión de redes sociales: Planificando, diseñando y ejecutando publicaciones regulares en nuestras plataformas sociales, empleando herramientas avanzadas como Adobe Photoshop, Adobe Illustrator, Canva, y tecnologías de inteligencia artificial como ChatGPT, Sora, Photoshop AI, ElevenLabs, entre otros, para la creación de contenidos visuales y textuales atractivos y relevantes en 3 idiomas.',
        'Automatización de Procesos: Combinando herramientas de IA Generativa como v0, CursorAI y ChatGPT y de automatización como Make.com o n8n, reduciendo así el tiempo en ciertos procesos más de un 80%. Automatizaciones hechas: Integración de Odoo + Mailjet para higiene de emails, creador de posts para el blog con interfaz propia',
        'Implementación de nuevas tecnologías: Formación al equipo comercial y equipo de diseñadores con herramientas de IA Generativa para diseño de producto reduciendo el tiempo de ciertas tareas más de un 92%',
        'Mejora de imagen de producto con IA',
        'Desarrollo y aplicación de las guías de branding de la marca',
        'Email marketing (Mailings automatizados y Newsletter Mensual): Generando leads a nivel internacional',
        'Gestión en Odoo de clientes: Desarrollo del protocolo de uso y cumplimiento',
        'Mantenimiento del Showroom',
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
  },
  en: {
    euromon: {
      title: 'Euromon PLV',
      subtitle: 'Marketing Specialist (2023–today)',
      highlights: [
        'Web design and development (UI/UX) + Web positioning (SEO): Multiplying organic traffic by x5 compared to before my incorporation',
        'Social media management: Planning, designing and executing regular posts on our social platforms, using advanced tools like Adobe Photoshop, Adobe Illustrator, Canva, and AI technologies such as ChatGPT, Sora, Photoshop AI, ElevenLabs, among others, for creating attractive and relevant visual and textual content in 3 languages.',
        'Process automation: Combining Generative AI tools like v0, CursorAI and ChatGPT with automation tools like Make.com or n8n, reducing time in certain processes by more than 80%. Automations made: Odoo + Mailjet integration for email hygiene, blog post creator with custom interface',
        'Implementation of new technologies: Training commercial team and design team with Generative AI tools for product design, reducing time in certain tasks by more than 92%',
        'Product image improvement with AI',
        'Development and application of brand branding guidelines',
        'Email marketing (Automated mailings and Monthly Newsletter): Generating leads internationally',
        'Customer management in Odoo: Development of usage protocol and compliance',
        'Showroom maintenance',
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
  },
}

interface SlideContentProps {
  slide: Slide
}

export default function SlideContent({ slide }: SlideContentProps) {
  const { language } = useLanguage()
  const [expandedProject, setExpandedProject] = useState<{
    project: { name: string | React.ReactNode; detail: string }
    rect: DOMRect
    index: number
  } | null>(null)
  const projectRefs = useRef<Map<number, HTMLLIElement>>(new Map())
  const [mounted, setMounted] = useState(false)
  
  // Estado para las tarjetas de timeline (Euromon y AI Lab)
  const [hoveredTimelineItem, setHoveredTimelineItem] = useState<string | null>(null)
  const [clickedTimelineItem, setClickedTimelineItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const timelineItemRefs = useRef<Map<string, HTMLElement>>(new Map())
  
  React.useEffect(() => {
    setMounted(true)
    // Detectar si es móvil o tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Incluye tablets (hasta 1024px)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const seeMoreText = language === 'es' ? 'Ver más' : 'See more'
  const saberMasText = language === 'es' ? 'Saber más' : 'Learn more'

  const eyebrow = slide.eyebrow ? (
    <p className={styles.slideEyebrow}>{slide.eyebrow}</p>
  ) : null

  const paragraphs = slide.paragraphs?.map((para, i) => (
    <p key={i} className={styles.slideParagraph}>
      {para}
    </p>
  ))

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const handleProjectClick = (project: { name: string | React.ReactNode; detail: string }, index: number) => {
    const element = projectRefs.current.get(index)
    if (element) {
      const rect = element.getBoundingClientRect()
      setExpandedProject({ project, rect, index })
      document.body.style.overflow = 'hidden'
    } else {
      console.log('Element not found for index:', index)
    }
  }

  const handleClose = () => {
    setExpandedProject(null)
    document.body.style.overflow = ''
  }

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (slide.type === 'text-media') {
    return (
      <div className={styles.slideShell}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {paragraphs}
        </div>
        <div className={styles.slideMedia}>
          {slide.media && (
            <Image
              src={slide.media.src}
              alt={slide.media.alt}
              width={360}
              height={480}
              className={styles.slideImage}
              style={{ aspectRatio: '3/4', objectFit: 'cover' }}
            />
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'timeline') {
    const timeline = slide.timeline
    
    // Función para obtener el key del modal basado en el título
    const getModalKey = (item: { title: string | React.ReactNode; detail: string }) => {
      let titleText = ''
      if (typeof item.title === 'string') {
        titleText = item.title
      } else if (React.isValidElement(item.title)) {
        // Si es un componente React, intentar obtener el texto
        const props = (item.title as any).props
        if (props?.text) {
          titleText = props.text
        } else if (props?.children) {
          titleText = typeof props.children === 'string' ? props.children : ''
        }
      }
      
      if (titleText.includes('Euromon PLV')) return 'euromon'
      if (titleText.includes('The AI Lab')) return 'ailab'
      return null
    }
    
    // Función para determinar si un item tiene "saber más"
    const hasLearnMore = (item: { title: string | React.ReactNode; detail: string }) => {
      return getModalKey(item) !== null
    }
    
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const handleTimelineItemHover = (key: string | null) => {
      if (!isMobile) {
        // Cancelar cualquier timeout pendiente
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        setHoveredTimelineItem(key)
      }
    }
    
    const handleTimelineItemLeave = (key: string | null) => {
      if (!isMobile) {
        // Esperar un poco antes de cerrar, por si el mouse va hacia la tarjeta
        hoverTimeoutRef.current = setTimeout(() => {
          setHoveredTimelineItem(null)
        }, 200)
      }
    }
    
    const handleTimelineItemClick = (key: string | null) => {
      if (isMobile) {
        setClickedTimelineItem(clickedTimelineItem === key ? null : key)
      }
    }
    
    // Limpiar timeout al desmontar
    React.useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])
    
    return (
      <>
        <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
          <div className={styles.slideText}>
            {eyebrow}
            <h2>{slide.title}</h2>
            {paragraphs}
            {timeline && (
              <div className={styles.timeline}>
                {timeline.map((item, i) => {
                  const isLast = i === timeline.length - 1
                  const modalKey = getModalKey(item)
                  const hasLearnMoreBtn = hasLearnMore(item)
                  const itemKey = modalKey || `item-${i}`
                  const isHovered = hoveredTimelineItem === modalKey
                  const isClicked = clickedTimelineItem === modalKey
                  const showCard = isMobile ? isClicked : isHovered
                  
                  return (
                    <div 
                      key={i} 
                      className={`${styles.timelineItem} ${isLast ? styles.timelineItemPast : ''} ${hasLearnMoreBtn ? styles.timelineItemWithLearnMore : ''}`}
                    >
                      <div className={styles.timelineItemContent}>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                        {hasLearnMoreBtn && (
                          <button
                            ref={(el) => {
                              if (el && modalKey) {
                                timelineItemRefs.current.set(modalKey, el)
                              }
                            }}
                            className={styles.learnMoreButton}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTimelineItemClick(modalKey)
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation()
                              handleTimelineItemHover(modalKey || null)
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation()
                              handleTimelineItemLeave(modalKey)
                            }}
                          >
                            {saberMasText}
                          </button>
                        )}
                      </div>
                      {mounted && hasLearnMoreBtn && showCard && modalKey && (
                        <TimelineCard
                          key={modalKey}
                          content={modalData[language]?.[modalKey]}
                          positionRef={timelineItemRefs.current.get(modalKey)}
                          onClose={() => {
                            if (hoverTimeoutRef.current) {
                              clearTimeout(hoverTimeoutRef.current)
                              hoverTimeoutRef.current = null
                            }
                            setHoveredTimelineItem(null)
                            setClickedTimelineItem(null)
                          }}
                          isMobile={isMobile}
                          onMouseEnter={() => handleTimelineItemHover(modalKey)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  if (slide.type === 'projects') {
    const projectsActive = slide.projectsActive
    const projectsPast = slide.projectsPast
    const projects = slide.projects
    const hasActiveProjects = projectsActive && projectsActive.length > 0
    const hasPastProjects = projectsPast && projectsPast.length > 0
    const hasLegacyProjects = projects && projects.length > 0

    let projectIndex = 0

    return (
      <>
        <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
          <div className={styles.slideText}>
            {eyebrow}
            <h2>{slide.title}</h2>
            {hasActiveProjects && projectsActive && (
              <div className={styles.projectsSection}>
                <h3 className={styles.projectsSectionTitle}>{language === 'es' ? 'Activos' : 'Active'}</h3>
                <ul className={styles.projectsList}>
                  {projectsActive.map((project, i) => {
                    const index = projectIndex++
                    return (
                      <li 
                        key={i}
                        ref={(el) => {
                          if (el) projectRefs.current.set(index, el)
                        }}
                        className={`${styles.projectCard} ${styles.projectCardActive}`}
                        onClick={() => handleProjectClick(project, index)}
                        data-interactive="true"
                      >
                        <strong>{project.name}</strong>
                        <span className={styles.projectDetail}>{truncateText(project.detail)}</span>
                        <span className={styles.seeMore}>{seeMoreText}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {hasPastProjects && projectsPast && (
              <div className={styles.projectsSection}>
                <h3 className={styles.projectsSectionTitle}>{language === 'es' ? 'Pasados' : 'Past'}</h3>
                <ul className={styles.projectsList}>
                  {projectsPast.map((project, i) => {
                    const index = projectIndex++
                    return (
                      <li 
                        key={i}
                        ref={(el) => {
                          if (el) projectRefs.current.set(index, el)
                        }}
                        className={styles.projectCard}
                        onClick={() => handleProjectClick(project, index)}
                        data-interactive="true"
                      >
                        <strong>{project.name}</strong>
                        <span className={styles.projectDetail}>{truncateText(project.detail)}</span>
                        <span className={styles.seeMore}>{seeMoreText}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {hasLegacyProjects && !hasActiveProjects && !hasPastProjects && projects && (
              <ul className={styles.projectsList}>
                {projects.map((project, i) => {
                  const index = projectIndex++
                  return (
                    <li 
                      key={i}
                      ref={(el) => {
                        if (el) projectRefs.current.set(index, el)
                      }}
                      className={styles.projectCard}
                      onClick={() => handleProjectClick(project, index)}
                    >
                      <strong>{project.name}</strong>
                      <span className={styles.projectDetail}>{truncateText(project.detail)}</span>
                      <span className={styles.seeMore}>Ver más</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
        {mounted && createPortal(
          <AnimatePresence>
            {expandedProject && (
              <>
                <motion.div
                  key="overlay"
                  className={styles.expandedOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.stopPropagation()
                    handleClose()
                  }}
                />
                <motion.div
                  key="card"
                  className={styles.expandedCard}
                  initial={{
                    x: `calc(-50% + ${expandedProject.rect.left + expandedProject.rect.width / 2 - window.innerWidth / 2}px)`,
                    y: `calc(-50% + ${expandedProject.rect.top + expandedProject.rect.height / 2 - window.innerHeight / 2}px)`,
                    scale: Math.min(expandedProject.rect.width / 600, expandedProject.rect.height / 400, 0.3),
                    opacity: 0,
                  }}
                  animate={{
                    x: '-50%',
                    y: '-50%',
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    x: `calc(-50% + ${expandedProject.rect.left + expandedProject.rect.width / 2 - window.innerWidth / 2}px)`,
                    y: `calc(-50% + ${expandedProject.rect.top + expandedProject.rect.height / 2 - window.innerHeight / 2}px)`,
                    scale: Math.min(expandedProject.rect.width / 600, expandedProject.rect.height / 400, 0.3),
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={styles.closeButton} onClick={handleClose}>
                    ×
                  </button>
                  <strong>{expandedProject.project.name}</strong>
                  <span className={styles.expandedDetail}>{expandedProject.project.detail}</span>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    )
  }

  if (slide.type === 'text-list') {
    return (
      <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {paragraphs}
          {slide.bullets && (
            <ul className={styles.slideBullets}>
              {slide.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'services') {
    return (
      <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {slide.services && (
            <div className={styles.servicesGrid}>
              {slide.services.map((service, i) => (
                <div key={i} className={styles.serviceCard}>
                  <strong>{service.title}</strong>
                  <p className={styles.slideParagraph}>{service.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'contact') {
    return (
      <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {paragraphs}
          {slide.links && (
            <div className={styles.contactActions}>
              {slide.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={styles.contactLink}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Componente para la tarjeta flotante de timeline
interface TimelineCardProps {
  content: any
  positionRef: HTMLElement | undefined
  onClose: () => void
  isMobile: boolean
  onMouseEnter?: () => void
}

function TimelineCard({ content, positionRef, onClose, isMobile, onMouseEnter }: TimelineCardProps) {
  if (!content) return null
  
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    // Solo calcular posición en desktop
    if (isMobile || !positionRef) return
    
    const updatePosition = () => {
      const rect = positionRef.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const scrollX = window.scrollX || window.pageXOffset
      
      // Dimensiones estimadas de la tarjeta
      const cardWidth = Math.min(400, window.innerWidth * 0.9)
      const cardHeight = 400
      const spacing = 8
      
      // Calcular espacio disponible
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      // Decidir si poner arriba o abajo
      const placeBelow = spaceBelow >= cardHeight + spacing || spaceBelow > spaceAbove
      
      // Calcular posición vertical
      let top: number
      if (placeBelow) {
        top = rect.bottom + scrollY + spacing
      } else {
        top = rect.top + scrollY - cardHeight - spacing
      }
      
      // Calcular posición horizontal (centrar, pero ajustar si se sale)
      const centerX = rect.left + scrollX + (rect.width / 2)
      const halfCardWidth = cardWidth / 2
      let left: number
      
      if (centerX - halfCardWidth < scrollX) {
        left = scrollX + halfCardWidth + 10
      } else if (centerX + halfCardWidth > scrollX + window.innerWidth) {
        left = scrollX + window.innerWidth - halfCardWidth - 10
      } else {
        left = centerX
      }
      
      setPosition({
        top,
        left,
      })
    }
    
    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [positionRef, isMobile])
  
  if (!mounted) return null
  
  if (isMobile) {
    // En móvil, usar un modal centrado
    return createPortal(
      <AnimatePresence>
        <motion.div
          key="overlay"
          className={styles.timelineCardOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        <div className={styles.timelineCardMobileContainer}>
          <motion.div
            key="timeline-card"
            className={styles.timelineCardMobile}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
        {isMobile && (
          <button className={styles.timelineCardClose} onClick={onClose}>
            ×
          </button>
        )}
        <h3 className={styles.timelineCardTitle}>{content.title}</h3>
        {content.subtitle && (
          <p className={styles.timelineCardSubtitle}>{content.subtitle}</p>
        )}
        {content.statsGroups && (
          <div className={styles.timelineCardStats}>
            {content.statsGroups.map((group: any[], i: number) => (
              <div key={i} className={styles.timelineCardStatsGrid}>
                {group.map((stat: any, j: number) => (
                  <div key={j} className={styles.timelineCardStat}>
                    <strong>{stat.value}</strong>
                    <small>{stat.label}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {content.highlights && (
          <ul className={styles.timelineCardHighlights}>
            {content.highlights.map((highlight: string, i: number) => (
              <li key={i} className={styles.timelineCardHighlight}>
                {highlight}
              </li>
            ))}
          </ul>
        )}
        {content.paragraphs?.map((para: string, i: number) => (
          <p key={i} className={styles.timelineCardParagraph}>
            {para}
          </p>
        ))}
        {content.note && (
          <p className={styles.timelineCardNote}>
            <em>{content.note}</em>
          </p>
        )}
        {content.socialLinks && (
          <div className={styles.timelineCardSocial}>
            {content.socialLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.timelineCardSocialLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    )
  }
  
  // En desktop, usar posicionamiento relativo al botón
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="timeline-card"
        className={styles.timelineCard}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
        onMouseEnter={() => {
          if (onMouseEnter) {
            onMouseEnter()
          }
        }}
        onMouseLeave={() => {
          onClose()
        }}
      >
        <h3 className={styles.timelineCardTitle}>{content.title}</h3>
        {content.subtitle && (
          <p className={styles.timelineCardSubtitle}>{content.subtitle}</p>
        )}
        {content.statsGroups && (
          <div className={styles.timelineCardStats}>
            {content.statsGroups.map((group: any[], i: number) => (
              <div key={i} className={styles.timelineCardStatsGrid}>
                {group.map((stat: any, j: number) => (
                  <div key={j} className={styles.timelineCardStat}>
                    <strong>{stat.value}</strong>
                    <small>{stat.label}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {content.highlights && (
          <ul className={styles.timelineCardHighlights}>
            {content.highlights.map((highlight: string, i: number) => (
              <li key={i} className={styles.timelineCardHighlight}>
                {highlight}
              </li>
            ))}
          </ul>
        )}
        {content.paragraphs?.map((para: string, i: number) => (
          <p key={i} className={styles.timelineCardParagraph}>
            {para}
          </p>
        ))}
        {content.note && (
          <p className={styles.timelineCardNote}>
            <em>{content.note}</em>
          </p>
        )}
        {content.socialLinks && (
          <div className={styles.timelineCardSocial}>
            {content.socialLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.timelineCardSocialLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

