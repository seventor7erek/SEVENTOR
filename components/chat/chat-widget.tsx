"use client"

import { useState, useCallback, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChatHeader } from "./chat-header"
import { ChatMessages, type Message } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { QuickActions } from "./quick-actions"

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to SEVENTOR. I am your AI Concierge. How can I craft an extraordinary event for you today?",
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobile, isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 300)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setIsClosing(false)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoading) return

      const userMessage: Message = { role: "user", content }
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `Error: ${response.status}`)
        }

        const data = await response.json()

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Connection interrupted."
        setError(errorMessage)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I apologize for the interruption. It seems there was a connection issue. Please try again shortly.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading]
  )

  // FAB Button
  const fab = (
    <button
      onClick={handleOpen}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full
        bg-gradient-to-br from-gold/90 to-gold-dark/90
        border border-gold-light/30
        flex items-center justify-center
        fab-glow
        hover:scale-105 active:scale-95
        transition-transform duration-300
        shadow-2xl"
      aria-label="Open AI Concierge"
    >
      <Sparkles size={22} className="text-emerald-abyss" />
    </button>
  )

  // Chat panel content (shared between desktop and mobile)
  const chatContent = (
    <>
      <ChatHeader onClose={handleClose} />
      <QuickActions onSelect={sendMessage} disabled={isLoading} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      {error && (
        <div className="px-4 pb-1">
          <p className="text-xs text-center text-destructive/80 font-sans">
            {error}
          </p>
        </div>
      )}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </>
  )

  if (!isOpen) return fab

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-[9999] bg-emerald-abyss/80 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
          aria-hidden="true"
        />
        {/* Bottom Sheet */}
        <div
          className={`fixed inset-x-0 bottom-0 z-[10000] h-[90vh] ${
            isClosing ? "slide-down" : "slide-up"
          }`}
        >
          <div className="h-full flex flex-col bg-emerald-abyss/95 backdrop-blur-2xl border-t border-gold/10 rounded-t-3xl overflow-hidden">
            {/* Swipe indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gold/20" />
            </div>
            {chatContent}
          </div>
        </div>
      </>
    )
  }

  // Desktop: Floating Panel
  return (
    <>
      {/* Backdrop for closing */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[600px] panel-in
          flex flex-col
          bg-emerald-abyss/95 backdrop-blur-2xl
          border border-gold/10
          rounded-2xl overflow-hidden
          shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(200,169,81,0.04)]"
      >
        {chatContent}
      </div>
    </>
  )
}
