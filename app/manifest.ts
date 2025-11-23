import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arturomartinezbellot.com'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arturo Martínez - AI & Marketing Expert',
    short_name: 'Arturo AI',
    description: 'Consultoría estratégica en AI Marketing, Growth y Transformación Digital',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/Who_Arturo.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/Who_Arturo.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}

