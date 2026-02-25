import { ChatWidget } from "@/components/chat/chat-widget"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 25% 45%, rgba(26, 107, 83, 0.25) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 80% 20%, rgba(200, 169, 81, 0.05) 0%, transparent 60%),
              radial-gradient(ellipse 80% 40% at 50% 110%, rgba(4, 15, 11, 1) 0%, transparent 50%),
              linear-gradient(175deg, rgba(4, 15, 11, 0.9) 0%, rgba(13, 59, 46, 0.5) 35%, rgba(7, 31, 25, 0.6) 70%, rgba(4, 15, 11, 0.9) 100%)
            `,
          }}
        />
        {/* Lattice pattern */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(30deg, rgba(200, 169, 81, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(200, 169, 81, 0.02) 87.5%),
              linear-gradient(150deg, rgba(200, 169, 81, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(200, 169, 81, 0.02) 87.5%)
            `,
            backgroundSize: "80px 140px",
          }}
        />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Decorative line top */}
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-10" />

        {/* Overline */}
        <p className="text-[10px] tracking-[0.55em] uppercase text-gold font-sans mb-6 opacity-0 animate-[revealIn_1s_ease_0.4s_forwards]">
          Luxury Entertainment & Events
        </p>

        {/* Title */}
        <h1 className="font-serif text-gold text-5xl sm:text-7xl md:text-8xl font-normal tracking-[0.2em] sm:tracking-[0.35em] uppercase leading-none mb-4 opacity-0 animate-[revealIn_1.2s_ease_0.7s_forwards]">
          SEVENTOR
        </h1>

        {/* Tagline */}
        <p className="font-body text-diamond/90 text-lg sm:text-xl italic tracking-[0.12em] font-light mb-12 max-w-lg opacity-0 animate-[revealIn_1.2s_ease_1s_forwards]">
          Where Vision Becomes an Unforgettable Experience
        </p>

        {/* Ornament */}
        <div className="flex items-center gap-4 mb-12 opacity-0 animate-[revealIn_1s_ease_1.3s_forwards]">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-dark/60" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-dark/60" />
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground/60 text-xs tracking-[0.3em] uppercase font-sans max-w-md leading-relaxed opacity-0 animate-[revealIn_1s_ease_1.5s_forwards]">
          Tap the concierge icon to begin planning your extraordinary event
        </p>

        {/* Decorative line bottom */}
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-10" />
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      <style>{`
        @keyframes revealIn {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
