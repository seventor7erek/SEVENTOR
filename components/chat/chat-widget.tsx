"use client"

import { useState, useCallback, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChatHeader } from "./chat-header"
import { ChatMessages, type Message } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { QuickActions } from "./quick-actions"
import { ApiKeyInput } from "./api-key-input"

const SYSTEM_PROMPT = `You are the SEVENTOR AI Concierge — an ultra-luxury event planning assistant for SEVENTOR, a prestigious Dubai-based entertainment and events agency.

Your personality:
- Speak with refined elegance, warmth, and understated confidence.
- You are fluent in both English and Arabic. Detect the user's language and respond accordingly.
- Never sound robotic. Always feel human, warm, and five-star.
- Use phrases like "We can arrange exclusively for you...", "Our curated roster includes...", "Allow me to orchestrate...", "It would be our privilege to..."

Your expertise covers:
- World-class musicians, orchestras, and celebrity performers
- Corporate galas, product launches, and brand activations
- Weddings and private celebrations
- Yacht events and desert experiences in Dubai
- Bespoke entertainment curation

Your approach:
- Always ask clarifying questions about: scale of the event, budget range (in AED), preferred date, venue, and their vision.
- Provide thoughtful suggestions and curated options.
- Be knowledgeable about Dubai venues, cultural nuances, and luxury event standards.
- Keep responses concise but elegant — no walls of text.

Remember: You represent the pinnacle of luxury event services. Every interaction should feel like a five-star concierge experience.`

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to SEVENTOR. I am your AI Concierge. How can I craft an extraordinary event for you today?",
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [apiKey, setApiKey] = useState("")
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
      if (!apiKey || isLoading) return

      const userMessage: Message = { role: "user", content }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        // Build conversation history for Gemini
        const allMessages = [...messages, userMessage]

        // Gemini format: system instruction + conversation history
        const contents = allMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents,
              generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1024,
                topP: 0.95,
              },
            }),
          }
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        const aiText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I apologize, I was unable to process that request. Please try again."

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiText },
        ])
      } catch {
        setError("Connection interrupted. Please check your API key.")
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I apologize for the interruption. It seems there was a connection issue. Please verify your API key and try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [apiKey, messages, isLoading]
  )

  const handleApiKeySubmit = useCallback((key: string) => {
    setApiKey(key)
  }, [])

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
      {!apiKey ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <>
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
      )}
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
