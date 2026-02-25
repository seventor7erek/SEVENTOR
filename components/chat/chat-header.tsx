"use client"

import { X } from "lucide-react"

interface ChatHeaderProps {
  onClose: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gold/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-emerald/80 border border-gold/20 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-light border-2 border-emerald-deep pulse-gold" />
        </div>
        <div>
          <h2 className="font-serif text-sm font-medium tracking-wider text-diamond">
            SEVENTOR
          </h2>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark font-sans">
            AI Concierge
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-emerald/50 transition-all duration-300"
        aria-label="Close chat"
      >
        <X size={16} />
      </button>
    </div>
  )
}
