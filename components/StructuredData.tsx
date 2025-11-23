'use client'

import { useEffect } from 'react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arturomartinezbellot.com'

export default function StructuredData() {
  useEffect(() => {
    // Person Schema
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Arturo Martínez',
      jobTitle: 'AI & Marketing Expert',
      description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital. 10+ años impulsando growth y activaciones tecnológicas para marcas y startups.',
      url: siteUrl,
      image: `${siteUrl}/Who_Arturo.jpeg`,
      email: 'hello@arturo.ai',
      sameAs: [
        'https://www.linkedin.com/in/arturo-martinez',
      ],
      knowsAbout: [
        'AI Marketing',
        'Marketing Strategy',
        'Growth Marketing',
        'Digital Transformation',
        'Computer Vision',
        'Marketing Automation',
        'AI Consulting',
        'Content Strategy',
      ],
      alumniOf: {
        '@type': 'Organization',
        name: 'The AI Lab',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Independent Consultant',
      },
    }

    // ProfessionalService Schema
    const professionalServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Arturo Martínez - AI & Marketing Consulting',
      description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital. Servicios de AI Strategy, Content & Training, Sparring Sessions y Copilots & Automation.',
      provider: {
        '@type': 'Person',
        name: 'Arturo Martínez',
        email: 'hello@arturo.ai',
      },
      areaServed: 'Worldwide',
      serviceType: [
        'AI Marketing Strategy',
        'Content & Training',
        'Consulting',
        'Marketing Automation',
      ],
      url: siteUrl,
    }

    // WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Arturo Martínez - AI & Marketing Expert',
      url: siteUrl,
      description: 'Portfolio profesional de Arturo Martínez, experto en AI Marketing y Growth Strategy.',
      author: {
        '@type': 'Person',
        name: 'Arturo Martínez',
      },
      inLanguage: ['es-ES', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // Organization Schema (for The AI Lab)
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'The AI Lab',
      description: 'Comunidad global sobre IA aplicada a negocio',
      founder: {
        '@type': 'Person',
        name: 'Arturo Martínez',
      },
      url: siteUrl,
    }

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: siteUrl,
        },
      ],
    }

    // Add all schemas to the page
    const schemas = [
      personSchema,
      professionalServiceSchema,
      websiteSchema,
      organizationSchema,
      breadcrumbSchema,
    ]

    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      script.id = `schema-${schema['@type'].toLowerCase().replace(/\s+/g, '-')}`
      document.head.appendChild(script)
    })

    // Cleanup function
    return () => {
      schemas.forEach((schema) => {
        const script = document.getElementById(
          `schema-${schema['@type'].toLowerCase().replace(/\s+/g, '-')}`
        )
        if (script) {
          script.remove()
        }
      })
    }
  }, [])

  return null
}

