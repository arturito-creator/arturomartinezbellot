'use client'

import { useEffect, useRef } from 'react'

export default function OrganicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let lines: Array<{ baseY: number; color: string }> = []
    const gap = 35
    let time = 0

    const mouse = { x: -1000, y: -1000 }
    const smoothMouse = { x: 0, y: 0 }

    function resize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initLines()
    }

    function initLines() {
      lines = []
      for (let y = -50; y < height + 50; y += gap) {
        lines.push({
          baseY: y,
          color: `rgba(0,0,0,${Math.random() * 0.04 + 0.02})`
        })
      }
    }

    function lerp(start: number, end: number, factor: number) {
      return start + (end - start) * factor
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      time += 0.008

      smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.1)
      smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.1)

      ctx.lineWidth = 1

      lines.forEach((line, i) => {
        ctx.beginPath()
        ctx.strokeStyle = line.color

        for (let x = 0; x <= width; x += 15) {
          const noise =
            Math.sin(x * 0.0025 + time + i * 0.1) * 15 +
            Math.cos(x * 0.008 - time * 0.5) * 8

          const dx = x - smoothMouse.x
          const dy = line.baseY - smoothMouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const interactionRadius = 350
          let interaction = 0

          if (dist < interactionRadius) {
            const force = (interactionRadius - dist) / interactionRadius
            interaction = Math.sin(force * Math.PI) * 80
          }

          const y = line.baseY + noise + interaction

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      id="organic-bg"
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    />
  )
}

