import { useEffect, useRef } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import fnpLogo from '../assets/fnpLogo.png'

const sections = [
  {
    id: 'hero',
    bg: 'url(https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?cs=srgb&dl=pexels-george-dolgikh-551816-1303082.jpg&fm=jpg)',
  },
  { id: 'about' },
  { id: 'features' },
  { id: 'gallery' },
]

const Landing = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const animated = Array.from(root.querySelectorAll('[data-animate]'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )

    animated.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ background: '#faf9f6' }}>
      {/* Hero */}
      <section
        id="hero"
        style={{
          height: '100vh',
          width: '100%',
          backgroundImage: sections[0].bg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
          }}
        />
        <div
          data-animate
          className="fade-up"
          style={{
            position: 'relative',
            textAlign: 'center',
            color: 'white',
            padding: '0 16px',
          }}
        >
          <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: 0, fontWeight: 800 }}>
            FNP Products Management Software
          </h1>
          <p style={{ fontSize: 18, opacity: 0.95, marginTop: 12, maxWidth: 760, marginInline: 'auto' }}>
            Powering the gifting lifecycle from catalog to checkout. Curate, control, and scale
            your assortment across cakes, flowers, personalized gifts and more.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#6f7f3f', borderColor: '#6f7f3f', borderRadius: 8 }}
            >
              Get Started
            </Button>
            <Button size="large" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About (Minimal, Clean) */}
      <section id="about" style={{ padding: '72px 16px', background: '#faf9f6' }}>
        <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <div style={{ width: 64, height: 4, background: '#c9d3a7', borderRadius: 999 }} />
          </div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #eef1e6',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <div className="grid" style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.15fr 1fr', alignItems: 'center' }}>
              <div data-animate className="fade-right">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#f3f7ec', color: '#2f3b14', borderRadius: 999, fontSize: 12, border: '1px solid #e1ead0' }}>
                  Thoughtfully built for gifting ops
                </div>
                <h2 style={{ fontSize: 30, margin: '10px 0 0', color: '#2f3b14', letterSpacing: 0.2 }}>
                  Minimal, fast and organized
                </h2>
                <p style={{ marginTop: 10, color: '#5d5d5d', lineHeight: 1.6 }}>
                  Keep your product catalog simple and accurate. Configure availability by state, manage
                  shipping SLAs, and enrich content all in a lightweight interface that teams love.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {[
                    'Unified catalog',
                    'Region-wise rules',
                    'Bulk CSV onboarding',
                    'Asset & copy enrichment',
                  ].map((chip) => (
                    <div
                      key={chip}
                      style={{
                        padding: '8px 12px',
                        background: '#f6f8f2',
                        border: '1px solid #e7eddc',
                        color: '#2f3b14',
                        borderRadius: 999,
                        fontSize: 13,
                        whiteSpace: 'nowrap',
                      }}
                      data-animate
                      className="fade-up"
                    >
                      {chip}
                    </div>
                  ))}
                </div>
              </div>
              <div data-animate className="fade-left">
                <img
                  alt="Gifting assortment"
                  style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #eef1e6' }}
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2068&auto=format&fit=crop"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features (Auto-scrolling carousel with smudged ends) */}
      <section id="features" style={{ padding: '48px 16px', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 data-animate className="fade-up" style={{ fontSize: 34, margin: 0, color: '#2f3b14' }}>
              Why teams choose FNP PMS
            </h2>
            <p data-animate className="fade-up" style={{ marginTop: 10, color: '#666' }}>
              Focused on clarity, speed, and control for gifting operations.
            </p>
          </div>
          <div className="feature-carousel" style={{ marginTop: 48 }}>
            <div className="feature-fade-left" />
            <div className="feature-fade-right" />
            <div className="feature-track">
              {[
                {
                  title: 'Powerful search & filters',
                  desc: 'Find by name, category, CID, shipping type, or status instantly.',
                },
                {
                  title: 'Bulk operations',
                  desc: 'CSV-driven create/update with validation and helpful error messages.',
                },
                {
                  title: 'Region-aware publishing',
                  desc: 'State-wise availability and SLA controls for accurate delivery promises.',
                },
                {
                  title: 'Clean, delightful UI',
                  desc: 'Optimized for speed and accessibility with subtle interactions.',
                },
                {
                  title: 'Role-based controls',
                  desc: 'Guard sensitive actions and ensure the right approvals.',
                },
                {
                  title: 'Rich product metadata',
                  desc: 'Descriptions, imagery and add-ons managed in one place.',
                },
              ].flatMap((f) => [f, f]).map((f, idx) => (
                <div
                  key={`${f.title}-${idx}`}
                  style={{
                    background: 'linear-gradient(180deg, #ffffff, #fbfcf8)',
                    border: '1px solid #eef1e6',
                    borderRadius: 14,
                    padding: 22,
                    boxShadow: '0 14px 30px rgba(0,0,0,0.05)',
                    minWidth: 280,
                    maxWidth: 320,
                  }}
                >
                  <h3 style={{ margin: 0, color: '#2f3b14', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</h3>
                  <p style={{ marginTop: 8, color: '#5a5a5a' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e2611', padding: '48px 16px 20px', color: '#cdd6bf', marginTop: 24 }}>
        <div className="container" style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(3, 1fr)', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={fnpLogo} alt="FNP" style={{ height: 28, width: 'auto', filter: 'grayscale(0) brightness(1.1)' }} />
                <strong style={{ color: '#e8f1d9', letterSpacing: 0.3 }}>FNP PMS</strong>
              </div>
              <p style={{ marginTop: 10, color: '#b8c3a5', maxWidth: 440 }}>
                Products Management Software crafted for the gifting industry — clarity, speed and control for your catalog.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <Button size="middle" onClick={() => navigate('/login')} style={{ borderRadius: 8 }}>Sign in</Button>
                <Button size="middle" type="primary" onClick={() => navigate('/products')} style={{ background: '#6f7f3f', borderColor: '#6f7f3f', borderRadius: 8 }}>Products</Button>
              </div>
            </div>
            {[
              { title: 'Product', links: ['Overview', 'Search & Filters', 'Bulk Upload', 'Publishing'] },
              { title: 'Resources', links: ['Docs', 'Guides', 'Support'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, color: '#e8f1d9' }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0' }}>
                  {col.links.map((l) => (
                    <li
                      key={l}
                      style={{ marginTop: 8, color: '#cdd6bf', cursor: 'pointer', transition: 'color 120ms ease' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLLIElement).style.color = '#ffffff')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLLIElement).style.color = '#cdd6bf')}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #2a3716', marginTop: 28, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: '#aeb99a' }}>© {new Date().getFullYear()} FNP PMS. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16, color: '#cdd6bf' }}>
              <span style={{ cursor: 'pointer' }}>Privacy</span>
              <span style={{ cursor: 'pointer' }}>Terms</span>
              <span style={{ cursor: 'pointer' }}>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing


