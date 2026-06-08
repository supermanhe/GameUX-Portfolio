"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function PulsatingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)} role="status" aria-label="图片加载中">
      <div className="flex space-x-2">
        {[0, 0.22, 0.44].map((delay) => (
          <motion.span
            key={delay}
            className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.45)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, delay }}
          />
        ))}
      </div>
    </div>
  )
}
