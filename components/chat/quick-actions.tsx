"use client"

const quickActions = [
  { label: "Book a Musician", icon: "🎻" },
  { label: "Corporate Event", icon: "🏢" },
  { label: "Wedding Inquiry", icon: "💍" },
  { label: "Yacht Event", icon: "⛵" },
  { label: "Desert Experience", icon: "🏜️" },
]

interface QuickActionsProps {
  onSelect: (action: string) => void
  disabled?: boolean
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="px-4 py-3 border-b border-gold/[0.06]">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => onSelect(`I'd like to inquire about: ${action.label}`)}
            disabled={disabled}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
              bg-emerald/60 border border-gold/[0.08] text-diamond/80
              text-xs tracking-wide font-sans
              hover:border-gold/25 hover:bg-emerald/80 hover:text-diamond
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-300 whitespace-nowrap"
          >
            <span className="text-sm">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
