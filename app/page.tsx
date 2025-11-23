'use client'

import { useState } from 'react'
import TopNav from '@/components/TopNav'
import OrganicBackground from '@/components/OrganicBackground'
import Slider from '@/components/Slider'
import Modal from '@/components/Modal'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <LanguageProvider>
      <OrganicBackground />
      <TopNav />
      <main role="main" aria-label="Contenido principal del portfolio">
        <Slider onHotspotClick={setActiveModal} />
      </main>
      <Modal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </LanguageProvider>
  )
}

