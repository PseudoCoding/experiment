import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const nodes: Node[] = []
    const NODE_COUNT = 80
    const CONNECTION_DISTANCE = 160
    const PULSE_SPEED = 0.008

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initNodes() {
      nodes.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * (canvas?.width ?? window.innerWidth),
          y: Math.random() * (canvas?.height ?? window.innerHeight),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    let pulse = 0
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pulse += PULSE_SPEED

      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary').trim() || '#6366f1'
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#06b6d4'

      // Update positions
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15
            const pulseFactor = 0.5 + 0.5 * Math.sin(pulse + i * 0.1)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `${primaryColor}${Math.floor(alpha * pulseFactor * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const pulseFactor = 0.6 + 0.4 * Math.sin(pulse + i * 0.2)
        const color = i % 3 === 0 ? accentColor : primaryColor

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.floor(node.opacity * pulseFactor * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4 * pulseFactor
        )
        gradient.addColorStop(0, `${color}20`)
        gradient.addColorStop(1, `${color}00`)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 4 * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    initNodes()
    draw()

    window.addEventListener('resize', () => {
      resize()
      initNodes()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  )
}
