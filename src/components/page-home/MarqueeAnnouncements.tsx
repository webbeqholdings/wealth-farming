'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: string[]
  direction?: 'left' | 'right'
  speed?: number
  className?: string
}

export function MarqueeAnnouncements({
  items,
  direction = 'left',
  speed = 20,
  className,
}: MarqueeProps) {
  const baseVelocity = direction === 'left' ? -speed : speed
  const baseX = useMotionValue(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [items])

  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000)

    if (containerRef.current) {
      if (direction === 'left') {
        if (baseX.get() <= -containerWidth) {
          baseX.set(0)
        }
      } else {
        if (baseX.get() >= 0) {
          baseX.set(-containerWidth)
        }
      }
    }

    baseX.set(baseX.get() + moveBy)
  })

  const x = useTransform(baseX, (v) => `${v}px`)

  return (
    <div className={cn('overflow-hidden bg-black', className)}>
      <motion.div ref={containerRef} className="flex whitespace-nowrap" style={{ x }}>
        {[...items, ...items].map((item, index) => (
          <React.Fragment key={index}>
            <span className="text-white px-4 py-2">{item}</span>
            {index !== items.length * 2 - 1 && <span className="text-green-500 px-2">•</span>}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
