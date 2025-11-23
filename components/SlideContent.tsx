'use client'

import Image from 'next/image'
import { Slide } from '@/data/slidesContent'
import styles from './SlideContent.module.css'

interface SlideContentProps {
  slide: Slide
}

export default function SlideContent({ slide }: SlideContentProps) {
  const eyebrow = slide.eyebrow ? (
    <p className={styles.slideEyebrow}>{slide.eyebrow}</p>
  ) : null

  const paragraphs = slide.paragraphs?.map((para, i) => (
    <p key={i} className={styles.slideParagraph}>
      {para}
    </p>
  ))

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
              {slide.timeline.map((item, i) => (
                <div key={i} className={styles.timelineItem}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'projects') {
    return (
      <div className={`${styles.slideShell} ${styles.slideShellStack}`}>
        <div className={styles.slideText}>
          {eyebrow}
          <h2>{slide.title}</h2>
          {slide.projects && (
            <ul className={styles.projectsList}>
              {slide.projects.map((project, i) => (
                <li key={i}>
                  <strong>{project.name}</strong>
                  <span>{project.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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

