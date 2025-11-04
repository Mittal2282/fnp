import { useEffect, useState } from 'react'
import fnpLogo from '../assets/fnpLogo.png'

interface WelcomeSplashProps {
  onDone: () => void
  durationMs?: number
}

const WelcomeSplash = ({ onDone, durationMs = 3400 }: WelcomeSplashProps) => {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const fadeWindow = Math.min(500, Math.max(300, Math.floor(durationMs * 0.2)))
    const closeAt = Math.max(0, durationMs - fadeWindow)
    const idClose = setTimeout(() => setClosing(true), closeAt)
    const idDone = setTimeout(onDone, durationMs)
    return () => {
      clearTimeout(idClose)
      clearTimeout(idDone)
    }
  }, [onDone, durationMs])

  return (
      <div className={`welcome-splash${closing ? ' closing' : ''}`}>
      <div className="welcome-splash-bg" />
      <div className="welcome-splash-content">
        <div className="welcome-badge">
          <img src={fnpLogo} alt="FNP" className="welcome-logo" />
        </div>
        <div className="welcome-title">Welcome!</div>
        <div className="welcome-sub">Let’s make gifting delightful ✨</div>

        {/* Gift illustration */}
        <div className="welcome-gift" aria-hidden>
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="56" width="88" height="52" rx="8" className="gift-box"/>
            <rect x="14" y="44" width="100" height="20" rx="6" className="gift-band"/>
            <g className="gift-lid">
              <rect x="16" y="36" width="96" height="14" rx="6" className="gift-lid-rect"/>
              <path d="M64 36 C48 18, 40 18, 34 32 C50 30, 58 34, 64 42 C70 34, 78 30, 94 32 C88 18, 80 18, 64 36 Z" className="gift-bow"/>
            </g>
          </svg>
        </div>
      </div>
      {/* floating shapes */}
      <div className="float dot d1" />
      <div className="float dot d2" />
      <div className="float dot d3" />
      <div className="float star s1">★</div>
      <div className="float star s2">★</div>
      <div className="float star s3">★</div>
      {/* confetti */}
      <div className="confetti c1" />
      <div className="confetti c2" />
      <div className="confetti c3" />
      <div className="confetti c4" />
      <div className="confetti c5" />
      <div className="splash-progress" />
    </div>
  )
}

export default WelcomeSplash


