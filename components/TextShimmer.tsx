'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface TextShimmerProps {
  children: string
  as?: React.ElementType
  className?: string
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  as: Component = 'span',
  className = '',
  duration = 1.5,
  spread = 5,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as any)

  const dynamicSpread = useMemo(() => {
    return children.length * spread
  }, [children, spread])

  return (
    <MotionComponent
      className={className}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.4) calc(50% - var(--spread)), rgba(255, 255, 255, 1) calc(50% - calc(var(--spread) * 0.4)), rgba(255, 255, 255, 1) calc(50% - calc(var(--spread) * 0.2)), currentColor calc(50% - calc(var(--spread) * 0.1)), currentColor calc(50% + calc(var(--spread) * 0.1)), rgba(255, 255, 255, 1) calc(50% + calc(var(--spread) * 0.2)), rgba(255, 255, 255, 1) calc(50% + calc(var(--spread) * 0.4)), rgba(0, 0, 0, 0.4) calc(50% + var(--spread))), linear-gradient(currentColor, currentColor)`,
          backgroundRepeat: 'no-repeat, padding-box',
          backgroundSize: '250% 100%, auto',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'inherit',
          display: 'inline-block',
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  )
}

