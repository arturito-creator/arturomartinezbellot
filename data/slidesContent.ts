export interface Slide {
  key: string
  type: 'text-media' | 'timeline' | 'projects' | 'text-list' | 'services' | 'contact'
  eyebrow: string
  title: string
  paragraphs?: string[]
  media?: { src: string; alt: string }
  timeline?: Array<{ title: string; detail: string }>
  projects?: Array<{ name: string; detail: string }>
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
        'Trabajo entre marketing, contenido e IA para diseñar experiencias con impacto medible.',
        'Hago de puente entre visión y ejecución: research rápido, sistemas que escalan y equipos que adoptan nuevas herramientas.',
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
        'Más de 10 años impulsando growth y activaciones tecnológicas para marcas y startups.',
      ],
      timeline: [
        { title: 'Euromon PLV', detail: 'Computer vision en retail físico +45% engagement' },
        { title: 'The AI Lab', detail: 'Comunidad global sobre IA aplicada a negocio' },
        { title: 'Consultoría independiente', detail: 'Roadmaps de IA para scale-ups y corporaciones' },
        { title: 'Docencia & workshops', detail: 'Masters y programas in-company sobre AI marketing' },
      ],
    },
    {
      key: 'projects',
      type: 'projects',
      eyebrow: 'Case studies',
      title: 'Proyectos',
      projects: [
        { name: 'Retail Sense', detail: 'Panel de insights en tienda para reordenar planogramas en tiempo real.' },
        { name: 'Creator OS', detail: 'Sistema de micro-vídeos con IA: +3M views orgánicos en 90 días.' },
        { name: 'Growth Sprints', detail: 'Experimentos de funnels que generaron +28% MRR en 6 semanas.' },
        { name: 'Executive Copilot', detail: 'Copiloto interno para priorizar casos de IA dentro de la empresa.' },
      ],
    },
    {
      key: 'content',
      type: 'text-list',
      eyebrow: 'Creator mode',
      title: 'Contenido & Charlas',
      paragraphs: [
        'Community-led learning: newsletters, pódcasts y microclases enfocadas en casos reales.',
        'He compartido escenario en masters, conferencias y compañías que quieren acelerar con IA.',
      ],
      bullets: [
        '+160K personas siguiendo los experimentos de The AI Lab.',
        'Talks en IE, ESIC, ISDI y foros corporativos de innovación.',
        'Series de micro-vídeos con >200M views combinados.',
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
        'I operate where marketing, content, and AI collide to build measurable experiences.',
        'I translate vision into execution: rapid research, scalable systems, and teams that adopt new tools fast.',
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
        '10+ years boosting growth and tech activations for brands and startups.',
      ],
      timeline: [
        { title: 'Euromon PLV', detail: 'Computer vision in physical retail delivering +45% engagement' },
        { title: 'The AI Lab', detail: 'Global community sharing applied AI playbooks' },
        { title: 'Independent consulting', detail: 'AI roadmaps for scale-ups and corporates' },
        { title: 'Teaching & workshops', detail: 'Masters and in-company programs on AI marketing' },
      ],
    },
    {
      key: 'projects',
      type: 'projects',
      eyebrow: 'Case studies',
      title: 'Projects',
      projects: [
        { name: 'Retail Sense', detail: 'In-store insight layer to rearrange planograms in real time.' },
        { name: 'Creator OS', detail: 'AI-powered micro-video system: +3M organic views in 90 days.' },
        { name: 'Growth Sprints', detail: 'Funnel experiments delivering +28% MRR in six weeks.' },
        { name: 'Executive Copilot', detail: 'Internal copilot to prioritize AI cases across teams.' },
      ],
    },
    {
      key: 'content',
      type: 'text-list',
      eyebrow: 'Creator mode',
      title: 'Content & Talks',
      paragraphs: [
        'Community-led learning: newsletters, podcasts, and micro-classes grounded in real cases.',
        'I speak at masters, conferences, and companies looking to accelerate with AI.',
      ],
      bullets: [
        '160K+ people following The AI Lab experiments.',
        'Talks at IE, ESIC, ISDI and corporate innovation forums.',
        'Micro-video series with 200M+ combined views.',
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

