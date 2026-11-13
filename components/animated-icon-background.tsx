"use client"

import React from "react"
import { UL0Icon, UL0IconName } from "./ul0-icon"

interface FloatingIconItem {
  name: UL0IconName
  top: string
  left?: string
  right?: string
  size: number
  delay: string
  duration: string
  opacity: string
}

const FLOATING_ICONS: FloatingIconItem[] = [
  { name: "link", top: "12%", left: "4%", size: 44, delay: "0s", duration: "6s", opacity: "opacity-30 dark:opacity-20" },
  { name: "qr", top: "18%", right: "5%", size: 48, delay: "1s", duration: "7s", opacity: "opacity-35 dark:opacity-20" },
  { name: "scissors", top: "45%", left: "6%", size: 40, delay: "2s", duration: "8s", opacity: "opacity-25 dark:opacity-15" },
  { name: "domain", top: "42%", right: "6%", size: 44, delay: "1.5s", duration: "6.5s", opacity: "opacity-30 dark:opacity-20" },
  { name: "sparkles", top: "70%", left: "8%", size: 36, delay: "0.5s", duration: "7.5s", opacity: "opacity-25 dark:opacity-15" },
  { name: "target", top: "72%", right: "9%", size: 40, delay: "2.5s", duration: "8s", opacity: "opacity-25 dark:opacity-15" },
  { name: "bolt", top: "85%", left: "15%", size: 34, delay: "3s", duration: "6s", opacity: "opacity-20 dark:opacity-15" },
  { name: "rocket", top: "86%", right: "16%", size: 38, delay: "1.8s", duration: "7s", opacity: "opacity-25 dark:opacity-15" },
]

export function AnimatedIconBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {FLOATING_ICONS.map((item, idx) => (
        <div
          key={idx}
          className={`absolute ${item.opacity} hidden md:block transition-transform hover:scale-110`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animation: `floatUpDown ${item.duration} ease-in-out infinite alternate`,
            animationDelay: item.delay,
          }}
        >
          <UL0Icon name={item.name} animated={true} size={item.size} />
        </div>
      ))}
      <style jsx global>{`
        @keyframes floatUpDown {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(3deg);
          }
          100% {
            transform: translateY(12px) rotate(-3deg);
          }
        }
      `}</style>
    </div>
  )
}
