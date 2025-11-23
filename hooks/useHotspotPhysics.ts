import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  ax: number // Aceleración en X (para inercia)
  ay: number // Aceleración en Y (para inercia)
  element: HTMLElement
  noiseSeed: number
}

export function useHotspotPhysics(
  sceneRef: React.RefObject<HTMLElement>,
  hotspotElements: HTMLElement[]
) {
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const sceneRectRef = useRef<DOMRect | null>(null)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    if (!sceneRef.current || hotspotElements.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
      return
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const sceneRect = sceneRef.current.getBoundingClientRect()
    sceneRectRef.current = sceneRect

    const centerX = sceneRect.left + sceneRect.width / 2
    const centerY = sceneRect.top + sceneRect.height / 2

    // Inicializar partículas
    const particles: Particle[] = hotspotElements.map((element, index) => {
      if (!element || !element.parentElement) {
        throw new Error(`Hotspot element ${index} is not in DOM`)
      }

      const angle = Math.random() * Math.PI * 2
      const radius = 50 + Math.random() * 150
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Aplicar posición inicial
      element.style.setProperty('position', 'fixed', 'important')
      element.style.setProperty('left', `${x}px`, 'important')
      element.style.setProperty('top', `${y}px`, 'important')
      element.style.setProperty('transform', 'translate(-50%, -50%)', 'important')
      element.style.setProperty('z-index', '50', 'important')
      element.style.setProperty('transition', 'none', 'important')

      // Velocidad inicial aleatoria
      const initialSpeed = 0.5 + Math.random() * 0.5
      const initialAngle = Math.random() * Math.PI * 2

      return {
        x,
        y,
        vx: Math.cos(initialAngle) * initialSpeed,
        vy: Math.sin(initialAngle) * initialSpeed,
        ax: 0, // Aceleración inicial
        ay: 0, // Aceleración inicial
        element,
        noiseSeed: Math.random() * 1000,
      }
    })

    particlesRef.current = particles
    timeRef.current = 0

    // Loop de animación
    const updatePhysics = () => {
      // Siempre continuar el loop, incluso si sceneRectRef es null
      // Solo actualizar si tenemos partículas y sceneRect
      if (particlesRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics)
        return
      }

      // Actualizar sceneRect en cada frame por si acaso cambia
      if (sceneRef.current) {
        sceneRectRef.current = sceneRef.current.getBoundingClientRect()
      }

      if (!sceneRectRef.current || particlesRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics)
        return
      }

      const particles = particlesRef.current
      const sceneRect = sceneRectRef.current
      const centerX = sceneRect.left + sceneRect.width / 2
      const centerY = sceneRect.top + sceneRect.height / 2

      // Incrementar tiempo SIEMPRE
      timeRef.current += 0.003

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // VELOCIDAD BASE CONSTANTE desde ruido (GARANTIZA movimiento perpetuo)
        const baseSpeed = 0.5
        const noiseAngle = timeRef.current + particle.noiseSeed
        const noiseX = Math.cos(noiseAngle)
        const noiseY = Math.sin(noiseAngle)

        // Establecer velocidad base DIRECTAMENTE desde ruido (siempre constante)
        const baseVx = noiseX * baseSpeed
        const baseVy = noiseY * baseSpeed

        // Calcular fuerzas de interacción
        let fx = 0 // Fuerza en X
        let fy = 0 // Fuerza en Y

        // REPULSIÓN entre partículas (Ley de Coulomb)
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDist = 20
          
          // Evitar división por cero
          const safeDistance = Math.max(distance, minDist)
          const distanceSquared = safeDistance * safeDistance
          
          // Fuerza de repulsión: F = k / r²
          const repulsionStrength = 8000
          const repulsionForce = repulsionStrength / distanceSquared
          
          // Componentes de la fuerza
          fx += (dx / safeDistance) * repulsionForce
          fy += (dy / safeDistance) * repulsionForce
        }

        // Atracción al centro (sutil para mantenerlos cerca del centro)
        const dxToCenter = centerX - particle.x
        const dyToCenter = centerY - particle.y
        const centerAttraction = 0.003
        fx += dxToCenter * centerAttraction
        fy += dyToCenter * centerAttraction

        // INERCIA: Las fuerzas afectan primero la aceleración (como cargas pesadas)
        // Las partículas tienen masa, por lo que responden gradualmente a las fuerzas
        const mass = 1.0 // Masa reducida = menos inercia (responden más rápido)
        const forceScale = 0.03 // Factor de escala aumentado para respuesta más rápida
        
        // Calcular aceleración desde las fuerzas: a = F / m
        const newAx = fx / mass * forceScale
        const newAy = fy / mass * forceScale
        
        // Aplicar inercia suavizada: mezclar aceleración anterior con nueva (para movimiento más suave)
        const inertiaDamping = 0.75 // Factor de inercia reducido (0.75 = menos inercia, más respuesta)
        particle.ax = particle.ax * inertiaDamping + newAx * (1 - inertiaDamping)
        particle.ay = particle.ay * inertiaDamping + newAy * (1 - inertiaDamping)

        // La aceleración afecta gradualmente la velocidad (inercia moderada)
        particle.vx += particle.ax
        particle.vy += particle.ay

        // Aplicar fricción muy sutil a la aceleración para evitar acumulación excesiva
        particle.ax *= 0.97 // Menos fricción para mantener más inercia
        particle.ay *= 0.97

        // COMBINAR: velocidad de interacción (con inercia) + velocidad base constante
        // La velocidad base garantiza movimiento constante, la interacción añade el efecto pesado
        const baseWeight = 0.6
        const interactionWeight = 0.4 // Aumentado para que la interacción sea más visible
        
        particle.vx = baseVx * baseWeight + particle.vx * interactionWeight
        particle.vy = baseVy * baseWeight + particle.vy * interactionWeight

        // Calcular velocidad
        let speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)

        // GARANTIZAR velocidad mínima (nunca menos que base)
        const minSpeed = baseSpeed * 0.7
        if (speed < minSpeed) {
          // Si la velocidad es muy baja, usar velocidad base completa
          particle.vx = baseVx
          particle.vy = baseVy
          speed = baseSpeed
        }

        // Limitar velocidad máxima
        const maxSpeed = 2.0
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed
          particle.vy = (particle.vy / speed) * maxSpeed
        }

        // Actualizar posición
        particle.x += particle.vx
        particle.y += particle.vy

        // Colisiones con bordes - REBOTES PERFECTOS SIN PÉRDIDA DE ENERGÍA
        const margin = 50
        const leftBound = sceneRect.left + margin
        const rightBound = sceneRect.right - margin
        const topBound = sceneRect.top + margin
        const bottomBound = sceneRect.bottom - margin

        // Rebote perfecto (coeficiente de restitución = 1.0 = sin pérdida de energía)
        if (particle.x < leftBound) {
          particle.x = leftBound
          particle.vx *= -1.0 // Rebote perfecto sin pérdida de energía
        } else if (particle.x > rightBound) {
          particle.x = rightBound
          particle.vx *= -1.0 // Rebote perfecto sin pérdida de energía
        }

        if (particle.y < topBound) {
          particle.y = topBound
          particle.vy *= -1.0 // Rebote perfecto sin pérdida de energía
        } else if (particle.y > bottomBound) {
          particle.y = bottomBound
          particle.vy *= -1.0 // Rebote perfecto sin pérdida de energía
        }

        // Aplicar posición al DOM
        const el = particle.element
        el.style.setProperty('position', 'fixed', 'important')
        el.style.setProperty('left', `${particle.x}px`, 'important')
        el.style.setProperty('top', `${particle.y}px`, 'important')
        el.style.setProperty('transform', 'translate(-50%, -50%)', 'important')
        el.style.setProperty('z-index', '50', 'important')
        el.style.setProperty('transition', 'none', 'important')
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics)
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [sceneRef, hotspotElements])
}
