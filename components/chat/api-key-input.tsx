"use client"

import { useState, type FormEvent } from "react"
import { Lock, ArrowRight } from "lucide-react"

interface ApiKeyInputProps {
  onSubmit: (key: string) => void
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [key, setKey] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!key.trim()) return
    onSubmit(key.trim())
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-[280px] text-center">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-emerald/60 border border-gold/15 flex items-center justify-center">
          <Lock size={18} className="text-gold/70" />
        </div>
        <p className="font-serif text-base text-diamond/90 mb-1.5 tracking-wide">
          Activate Concierge
        </p>
        <p className="text-xs text-muted-foreground/60 mb-6 font-sans leading-relaxed">
          Enter your Gemini API Key to begin your luxury experience
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Gemini API Key"
            className="w-full bg-emerald-deep/80 border border-gold/[0.1] rounded-xl px-4 py-3
              text-sm text-diamond placeholder:text-muted-foreground/40 outline-none
              focus:border-gold/25 transition-colors duration-300 font-sans"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              bg-gold/10 border border-gold/20 text-gold text-xs tracking-widest uppercase font-sans font-medium
              hover:bg-gold/20 hover:border-gold/35
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-300"
          >
            <span>Activate</span>
            <ArrowRight size={12} />
          </button>
        </form>
      </div>
    </div>
  )
}
