"use client"

import { useEffect, useRef } from "react"

export interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto chat-scrollbar px-4 py-4 space-y-3">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              message.role === "user"
                ? "bg-gold/[0.12] border border-gold/[0.15] rounded-2xl rounded-br-md text-diamond"
                : "bg-emerald/60 backdrop-blur-sm border border-gold/[0.06] rounded-2xl rounded-bl-md text-diamond/90"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-emerald/60 backdrop-blur-sm border border-gold/[0.06] rounded-2xl rounded-bl-md px-5 py-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
              <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
              <div className="w-2 h-2 rounded-full bg-gold typing-dot" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
