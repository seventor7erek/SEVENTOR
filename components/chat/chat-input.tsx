"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input.trim())
    setInput("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2">
      <div className="flex items-end gap-2 rounded-2xl bg-emerald-deep/80 border border-gold/[0.1] px-4 py-2 focus-within:border-gold/25 transition-colors duration-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-sm text-diamond placeholder:text-muted-foreground/60 resize-none outline-none py-2 max-h-24 font-sans leading-relaxed disabled:opacity-40"
          style={{ minHeight: "36px" }}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
            bg-gold/10 border border-gold/20 text-gold
            hover:bg-gold/20 hover:border-gold/40
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-300"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </div>
      <p className="text-center text-[9px] text-muted-foreground/40 mt-2 tracking-wider uppercase font-sans">
        Powered by SEVENTOR AI
      </p>
    </form>
  )
}
