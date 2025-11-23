'use client'

import { useState, useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Slide } from '@/data/slidesContent'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './SlideContent.module.css'

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
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const seeMoreText = language === 'es' ? 'Ver más' : 'See more'

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
    return (
      <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {paragraphs}
          {slide.timeline && (
            <div className={styles.timeline}>
              {slide.timeline.map((item, i) => {
                const isLast = i === slide.timeline.length - 1
                return (
                  <div key={i} className={`${styles.timelineItem} ${isLast ? styles.timelineItemPast : ''}`}>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'projects') {
    const hasActiveProjects = slide.projectsActive && slide.projectsActive.length > 0
    const hasPastProjects = slide.projectsPast && slide.projectsPast.length > 0
    const hasLegacyProjects = slide.projects && slide.projects.length > 0

    let projectIndex = 0

    return (
      <>
        <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
          <div className={styles.slideText}>
            {eyebrow}
            <h2>{slide.title}</h2>
            {hasActiveProjects && (
              <div className={styles.projectsSection}>
                <h3 className={styles.projectsSectionTitle}>{language === 'es' ? 'Activos' : 'Active'}</h3>
                <ul className={styles.projectsList}>
                  {slide.projectsActive.map((project, i) => {
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
            {hasPastProjects && (
              <div className={styles.projectsSection}>
                <h3 className={styles.projectsSectionTitle}>{language === 'es' ? 'Pasados' : 'Past'}</h3>
                <ul className={styles.projectsList}>
                  {slide.projectsPast.map((project, i) => {
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
            {hasLegacyProjects && !hasActiveProjects && !hasPastProjects && (
              <ul className={styles.projectsList}>
                {slide.projects.map((project, i) => {
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

