'use client'

import GoogleAnalytics from './GoogleAnalytics'
import Hotjar from './Hotjar'

interface AnalyticsWrapperProps {
  gaId?: string
  hjid?: number | string
}

export default function AnalyticsWrapper({ gaId, hjid }: AnalyticsWrapperProps) {
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Hotjar hjid={hjid} />
    </>
  )
}

