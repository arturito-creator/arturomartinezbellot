import React from 'react'
import GlitchText from '@/components/GlitchText'

export interface Slide {
  key: string
  type: 'text-media' | 'timeline' | 'projects' | 'text-list' | 'services' | 'contact'
  eyebrow: string
  title: string
  paragraphs?: (string | React.ReactNode)[]
  media?: { src: string; alt: string }
  timeline?: Array<{ title: string | React.ReactNode; detail: string }>
  projects?: Array<{ name: string | React.ReactNode; detail: string; status?: 'active' | 'past' }>
  projectsActive?: Array<{ name: string | React.ReactNode; detail: string }>
  projectsPast?: Array<{ name: string | React.ReactNode; detail: string }>
  bullets?: string[]
  services?: Array<{ title: string; detail: string }>
  links?: Array<{ label: string; href: string; external?: boolean }>
}

export const slidesContent: Record<'es' | 'en', Slide[]> = {
  es: [
    {
      key: 'about',
      type: 'text-media',
      eyebrow: 'Quién soy',
      title: 'Quién soy',
      paragraphs: [
        <>Me mueven tres cosas: la <em>tecnología</em>, el <em>emprendimiento</em> y la <em>curiosidad</em> por aprender rápido.</>,
        'Soy de los que necesitan entender cómo funcionan las cosas y probar ideas construyendo proyectos reales, no solo pensándolas.',
        'Vengo de un background técnico y de haber vivido fuera (Países Bajos y Shanghái), lo que me ha dado una forma de pensar bastante internacional.',
        'Hoy me muevo entre producto, contenido e IA: experimento con herramientas, diseño experiencias digitales y monto sistemas (webs, automatizaciones, flujos de contenido) que resuelven problemas concretos y se pueden medir.',
      ],
      media: {
        src: '/Who_Arturo.jpeg',
        alt: 'Retrato Arturo Martínez',
      },
    },
    {
      key: 'experience',
      type: 'timeline',
      eyebrow: 'Trayectoria',
      title: 'Experiencia',
      paragraphs: [
        'Trabajo entre marketing, IA y producto digital, combinando rol in-house, docencia y proyectos propios.',
      ],
      timeline: [
        { 
          title: <GlitchText text="[REDACTED] Creators AI" />,
          detail: 'Nuevo proyecto alrededor de IA y producto digital, aún no público.'
        },
        { 
          title: 'La Salle BCN · Profesor de máster (2025–hoy)',
          detail: 'Sesiones sobre cómo aplicar la IA al marketing en programas de máster.'
        },
        { 
          title: 'Euromon PLV · Marketing Specialist (2023–hoy)',
          detail: 'Responsable de Marketing: web y SEO, email marketing, CRM (Odoo), contenido, gestión del showroom y apoyo al equipo comercial, apoyándome en automatización e IA para poder hacerlo en media jornada.'
        },
        { 
          title: 'The AI Lab · Co-founder (2024–2025)',
          detail: 'Proyecto de contenido sobre IA con +160k seguidores y ~100M visualizaciones entre TikTok e Instagram.'
        },
      ],
    },
    {
      key: 'projects',
      type: 'projects',
      eyebrow: 'Case studies',
      title: 'Proyectos',
      projectsActive: [
        { 
          name: <><GlitchText text="[REDACTED] Creators AI" /> · Proyecto en fase stealth</>,
          detail: 'Proyecto propio aún no público para ayudar a creadores a usar la IA de forma más estratégica: ideas, guiones y sistemas alrededor del contenido.'
        },
        { 
          name: 'Dominicana Blockchain Week 2026',
          detail: 'Marketing y crecimiento para un evento internacional de blockchain en República Dominicana: narrativa de marca, contenido y captación de asistentes para la edición 2026.'
        },
      ],
      projectsPast: [
        { 
          name: 'The AI Lab (2024–2025)',
          detail: 'Proyecto de contenido sobre IA con más de 160k seguidores y ~100M visualizaciones entre TikTok e Instagram, centrado en workflows reales y herramientas prácticas.'
        },
        { 
          name: 'Aihelpstudy.com (2025)',
          detail: 'Side project para ayudar a estudiantes a usar IA al estudiar: estructurar apuntes, resolver dudas y preparar exámenes de forma más eficiente.'
        },
        { 
          name: 'Nights (2022–2023)',
          detail: 'Proyecto personal para explorar producto digital alrededor del ocio nocturno: ideas, prototipos y primeras validaciones con usuarios.'
        },
        { 
          name: 'Treball de Recerca – sistema de vigilancia con dron (2020–2021)',
          detail: 'Trabajo de investigación premiado: sistema autónomo de vigilancia con dron y recogida de pruebas en tiempo real, ganador del VII Concurs Maria Kolt de Treballs de Recerca (La Miranda).'
        },
      ],
    },
    {
      key: 'services',
      type: 'services',
      eyebrow: 'Cómo te ayudo',
      title: 'Servicios',
      services: [
        { title: 'AI Marketing Strategy', detail: 'Roadmaps y casos de uso accionables con foco en impacto comercial.' },
        { title: 'Contenido & Formación', detail: 'Workshops, playbooks y academias internas para activar IA.' },
        { title: 'Consultoría puntual', detail: 'Sparring sessions para founders, CMOs y equipos de innovación.' },
        { title: 'Copilotos & automatización', detail: 'Diseño de flujos híbridos (human + AI) para equipos de growth.' },
      ],
    },
    {
      key: 'contact',
      type: 'contact',
      eyebrow: 'Let\'s build',
      title: 'Contacto',
      paragraphs: [
        '¿Listo para lanzar algo nuevo? Escríbeme y diseñamos juntos la siguiente iteración.',
      ],
      links: [
        { label: 'Email', href: 'mailto:hello@arturo.ai' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturo-martinez', external: true },
      ],
    },
  ],
  en: [
    {
      key: 'about',
      type: 'text-media',
      eyebrow: 'About me',
      title: 'About me',
      paragraphs: [
        <>Three things drive me: <em>technology</em>, <em>entrepreneurship</em>, and a strong <em>curiosity</em> to learn fast.</>,
        'I\'m the kind of person who needs to understand how things work and test ideas by building real projects, not just thinking about them.',
        'I come from a technical background and have lived abroad (in the Netherlands and in Shanghai), which has given me a genuinely international way of thinking.',
        'Today I move between product, content, and AI: I experiment with tools, design digital experiences, and build systems (websites, automations, content flows) that solve concrete problems and can be measured.',
      ],
      media: {
        src: '/Who_Arturo.jpeg',
        alt: 'Portrait Arturo Martínez',
      },
    },
    {
      key: 'experience',
      type: 'timeline',
      eyebrow: 'Journey',
      title: 'Experience',
      paragraphs: [
        'I work between marketing, AI, and digital product, combining in-house roles, teaching, and my own projects.',
      ],
      timeline: [
        { 
          title: <GlitchText text="[REDACTED] Creators AI" />,
          detail: 'New project around AI and digital product, not yet public.'
        },
        { 
          title: 'La Salle BCN · Master\'s Professor (2025–today)',
          detail: 'Sessions on how to apply AI to marketing in master\'s programs.'
        },
        { 
          title: 'Euromon PLV · Marketing Specialist (2023–today)',
          detail: 'Marketing Manager: web and SEO, email marketing, CRM (Odoo), content, showroom management, and support to the sales team, leveraging automation and AI to accomplish this in half a day.'
        },
        { 
          title: 'The AI Lab · Co-founder (2024–2025)',
          detail: 'AI content project with +160k followers and ~100M views across TikTok and Instagram.'
        },
      ],
    },
    {
      key: 'projects',
      type: 'projects',
      eyebrow: 'Case studies',
      title: 'Projects',
      projectsActive: [
        { 
          name: <><GlitchText text="[REDACTED] Creators AI" /> · Project in stealth phase</>,
          detail: 'Own project not yet public to help creators use AI more strategically: ideas, scripts, and systems around content.'
        },
        { 
          name: 'Dominicana Blockchain Week 2026',
          detail: 'Marketing and growth for an international blockchain event in the Dominican Republic: brand narrative, content, and attendee acquisition for the 2026 edition.'
        },
      ],
      projectsPast: [
        { 
          name: 'The AI Lab (2024–2025)',
          detail: 'AI content project with over 160k followers and ~100M views across TikTok and Instagram, focused on real workflows and practical tools.'
        },
        { 
          name: 'Aihelpstudy.com (2025)',
          detail: 'Side project to help students use AI when studying: structure notes, solve doubts, and prepare exams more efficiently.'
        },
        { 
          name: 'Nights (2022–2023)',
          detail: 'Personal project to explore digital product around nightlife: ideas, prototypes, and first user validations.'
        },
        { 
          name: 'Research Project – drone surveillance system (2020–2021)',
          detail: 'Award-winning research work: autonomous drone surveillance system with real-time evidence collection, winner of the VII Maria Kolt Research Work Contest (La Miranda).'
        },
      ],
    },
    {
      key: 'services',
      type: 'services',
      eyebrow: 'How I help',
      title: 'Services',
      services: [
        { title: 'AI Marketing Strategy', detail: 'Roadmaps and use cases focused on commercial impact.' },
        { title: 'Content & Training', detail: 'Workshops, playbooks, and internal academies to activate AI.' },
        { title: 'Sparring sessions', detail: 'On-demand consulting for founders, CMOs, and innovation teams.' },
        { title: 'Copilots & automation', detail: 'Hybrid (human + AI) flows for growth and product squads.' },
      ],
    },
    {
      key: 'contact',
      type: 'contact',
      eyebrow: 'Let\'s build',
      title: 'Contact',
      paragraphs: [
        "Ready to ship the next iteration? Reach out and let's design it together.",
      ],
      links: [
        { label: 'Email', href: 'mailto:hello@arturo.ai' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturo-martinez', external: true },
      ],
    },
  ],
}

export const homeSlideLabels = {
  es: 'Inicio',
  en: 'Home',
}

