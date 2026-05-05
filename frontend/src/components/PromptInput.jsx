import React, { useState, useEffect, useRef } from 'react';

const EXAMPLES = [
  'E-commerce fashion store with dark luxury feel',
  'SaaS dashboard for analytics and data visualization',
  'Healthcare appointment booking platform',
  'Social media app for creative professionals',
  'AI-powered learning management system',
  'Food delivery app with warm vibrant colors',
  'Crypto wallet with neon cyberpunk theme',
  'Travel booking platform with immersive visuals',
];

const CAPABILITIES = [
  {
    icon: '🎨',
    title: 'Dual Layout Generation',
    desc: 'Always get one dark + one light variant — two completely different visual directions in one shot.',
    color: '#5b6ef5',
  },
  {
    icon: '⚡',
    title: 'Domain Intelligence',
    desc: 'Detects your product type — SaaS, ecommerce, healthcare, finance — and tailors every component.',
    color: '#a78bfa',
  },
  {
    icon: '🖥',
    title: 'Real HTML Output',
    desc: 'Not wireframes. Full production-ready HTML with real copy, real sections, real interactivity.',
    color: '#38bdf8',
  },
  {
    icon: '🧠',
    title: 'Color + Type System',
    desc: 'Each layout ships with a complete palette, mood, font pairings, sizes, and spacing rationale.',
    color: '#f472b6',
  },
  {
    icon: '📐',
    title: 'Section Architecture',
    desc: 'Navbar, hero, stats, features, testimonials, CTA and footer — all designed with layout hints.',
    color: '#34d399',
  },
  {
    icon: '🚀',
    title: 'Download & Ship',
    desc: 'Copy the HTML or download directly. Use as a prototype, pitch deck, or starting codebase.',
    color: '#fb923c',
  },
];

const STEPS = [
  { num: '01', label: 'Describe', desc: 'Write what your product does in plain English. The more specific, the better.' },
  { num: '02', label: 'Analyze', desc: 'AI detects your domain and crafts two divergent design directions.' },
  { num: '03', label: 'Generate', desc: 'Full HTML layouts appear with colors, typography, and real components.' },
  { num: '04', label: 'Export', desc: 'Preview fullscreen, copy HTML, or download — ready to ship.' },
];

const DOMAINS = [
  { emoji: '🏥', name: 'Healthcare' },
  { emoji: '🛍', name: 'E-commerce' },
  { emoji: '📊', name: 'SaaS / Analytics' },
  { emoji: '🎓', name: 'EdTech' },
  { emoji: '💰', name: 'Finance' },
  { emoji: '🍔', name: 'Food & Delivery' },
  { emoji: '✈️', name: 'Travel' },
  { emoji: '💪', name: 'Fitness' },
];

// Animated floating orb
function Orb({ style }) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(60px)',
      pointerEvents: 'none',
      ...style,
    }} />
  );
}

// Animated number counter
function Counter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function PromptInput({ onGenerate, error }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [hoveredCap, setHoveredCap] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [marqueePos, setMarqueePos] = useState(0);

  // Smooth marquee animation
  useEffect(() => {
    let frame;
    let pos = 0;
    const tick = () => {
      pos -= 0.4;
      setMarqueePos(pos);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = () => {
    if (value.trim().length < 5) return;
    onGenerate(value.trim());
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const marqueeDomains = [...DOMAINS, ...DOMAINS, ...DOMAINS];
  const itemWidth = 160;
  const totalWidth = DOMAINS.length * itemWidth;
  const normalizedPos = ((marqueePos % totalWidth) + totalWidth) % totalWidth;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 60, paddingBottom: 80 }}>

      {/* ── HERO SECTION ── */}
      <div style={{ textAlign: 'center', marginBottom: 60, position: 'relative' }}>
        {/* Decorative orbs */}
        <Orb style={{ width: 300, height: 300, top: -80, left: '10%', background: 'rgba(91,110,245,0.12)', animationName: 'float', animationDuration: '6s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        <Orb style={{ width: 200, height: 200, top: 20, right: '5%', background: 'rgba(167,139,250,0.1)', animationName: 'float', animationDuration: '8s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '-3s' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(91,110,245,0.1)',
          border: '1px solid rgba(91,110,245,0.3)',
          borderRadius: 100, padding: '6px 18px',
          fontSize: 12, color: '#a78bfa',
          letterSpacing: '0.12em', marginBottom: 28,
          textTransform: 'uppercase', animation: 'fadeUp 0.4s ease both',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
          AI UX Design Generator · Powered by LLaMA 3.3
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          marginBottom: 24,
          animation: 'fadeUp 0.5s ease 0.05s both',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #f0f2ff 0%, #c4c9ff 40%, #a78bfa 75%, #5b6ef5 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Describe your idea.
          </span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #7a85a3 0%, #a78bfa 60%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Get 2 full layouts.
          </span>
        </h1>

        <p style={{
          color: '#7a85a3', fontSize: 18, lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 0',
          animation: 'fadeUp 0.5s ease 0.1s both',
        }}>
          Type what you're building. GenUx generates two complete,
          production-ready UX layout directions — color systems, typography,
          real components — in under a minute.
        </p>
      </div>

      {/* ── INPUT BOX ── */}
      <div style={{ animation: 'fadeUp 0.5s ease 0.15s both', marginBottom: 16 }}>
        <div style={{
          background: 'rgba(15,22,36,0.85)',
          border: `1px solid ${focused ? 'rgba(91,110,245,0.7)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 22,
          padding: '24px 24px 16px',
          backdropFilter: 'blur(24px)',
          boxShadow: focused
            ? '0 0 0 4px rgba(91,110,245,0.1), 0 24px 60px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
        }}>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder={`Describe your app or website idea...\ne.g. "A luxury real estate platform with immersive property galleries and AI-powered valuation"`}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none',
              color: '#f0f2ff', fontSize: 16,
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.7, resize: 'none', minHeight: 110,
            }}
            rows={5}
          />

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginTop: 12,
            paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                {value.length} chars
              </span>
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                ⌘↵ to generate
              </span>
              {value.length > 0 && (
                <button
                  onClick={() => setValue('')}
                  style={{
                    background: 'none', border: 'none',
                    color: '#4b5563', cursor: 'pointer',
                    fontSize: 12, padding: 0,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >✕ Clear</button>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={value.trim().length < 5}
              style={{
                background: value.trim().length >= 5
                  ? 'linear-gradient(135deg, #5b6ef5 0%, #a78bfa 100%)'
                  : 'rgba(255,255,255,0.05)',
                color: value.trim().length >= 5 ? '#fff' : '#4b5563',
                border: 'none', borderRadius: 14,
                padding: '13px 32px', fontSize: 14, fontWeight: 700,
                fontFamily: 'Syne, sans-serif',
                cursor: value.trim().length >= 5 ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease',
                letterSpacing: '0.01em',
                boxShadow: value.trim().length >= 5 ? '0 4px 20px rgba(91,110,245,0.4)' : 'none',
              }}
            >
              ✦ Generate Layouts
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '14px 20px',
          color: '#fca5a5', fontSize: 14, marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Example pills */}
      <div style={{ marginBottom: 80, animation: 'fadeUp 0.5s ease 0.2s both' }}>
        <div style={{
          fontSize: 11, color: '#4b5563', marginBottom: 10,
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>Try an example →</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setValue(ex)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100, padding: '7px 15px',
                fontSize: 12, color: '#7a85a3', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(91,110,245,0.12)';
                e.currentTarget.style.borderColor = 'rgba(91,110,245,0.4)';
                e.currentTarget.style.color = '#c4c9ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#7a85a3';
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, borderRadius: 20, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 80, animation: 'fadeUp 0.5s ease 0.25s both',
      }}>
        {[
          { val: 12, suffix: '+', label: 'Domains Supported' },
          { val: 8, suffix: '', label: 'Sections Per Layout' },
          { val: 2, suffix: 'x', label: 'Layouts Per Prompt' },
          { val: 45, suffix: 's', label: 'Avg Generation Time' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(15,22,36,0.7)',
            backdropFilter: 'blur(12px)',
            padding: '28px 20px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 36, fontWeight: 800,
              background: 'linear-gradient(135deg, #f0f2ff, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 6,
            }}>
              <Counter target={s.val} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: 12, color: '#7a85a3', letterSpacing: '0.04em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ marginBottom: 80, animation: 'fadeUp 0.5s ease 0.3s both' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11, color: '#5b6ef5',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>How it works</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 32,
            fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.03em',
          }}>Four steps to your layout</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                background: hoveredStep === i
                  ? 'rgba(91,110,245,0.1)'
                  : 'rgba(15,22,36,0.6)',
                border: `1px solid ${hoveredStep === i ? 'rgba(91,110,245,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 18, padding: '28px 22px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                transform: hoveredStep === i ? 'translateY(-4px)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 11, fontWeight: 700,
                color: hoveredStep === i ? '#a78bfa' : '#5b6ef5',
                letterSpacing: '0.1em', marginBottom: 14,
                transition: 'color 0.3s ease',
              }}>{step.num}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 17, fontWeight: 700,
                color: '#f0f2ff', marginBottom: 10,
                letterSpacing: '-0.02em',
              }}>{step.label}</div>
              <div style={{
                fontSize: 13, color: '#7a85a3', lineHeight: 1.65,
              }}>{step.desc}</div>

              {/* connector line except last */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', right: -9, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 18, height: 1,
                  background: 'rgba(91,110,245,0.3)',
                  display: 'none', // hidden on grid layout, decorative
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CAPABILITIES GRID ── */}
      <div style={{ marginBottom: 80, animation: 'fadeUp 0.5s ease 0.35s both' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            fontSize: 11, color: '#5b6ef5',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12,
          }}>What you get</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 32,
            fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.03em',
          }}>Everything in one generation</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {CAPABILITIES.map((cap, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCap(i)}
              onMouseLeave={() => setHoveredCap(null)}
              style={{
                background: hoveredCap === i
                  ? `rgba(${cap.color === '#5b6ef5' ? '91,110,245' : cap.color === '#a78bfa' ? '167,139,250' : cap.color === '#38bdf8' ? '56,189,248' : cap.color === '#f472b6' ? '244,114,182' : cap.color === '#34d399' ? '52,211,153' : '251,146,60'},0.08)`
                  : 'rgba(15,22,36,0.55)',
                border: `1px solid ${hoveredCap === i ? cap.color + '44' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 18, padding: '26px 24px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                transform: hoveredCap === i ? 'translateY(-4px)' : 'none',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: cap.color + '22',
                border: `1px solid ${cap.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 16,
                transition: 'all 0.3s ease',
                boxShadow: hoveredCap === i ? `0 0 20px ${cap.color}33` : 'none',
              }}>{cap.icon}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: 15,
                fontWeight: 700, color: '#f0f2ff',
                marginBottom: 8, letterSpacing: '-0.02em',
              }}>{cap.title}</div>
              <div style={{ fontSize: 13, color: '#7a85a3', lineHeight: 1.65 }}>
                {cap.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DOMAIN MARQUEE ── */}
      <div style={{ marginBottom: 80, animation: 'fadeUp 0.5s ease 0.4s both' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 11, color: '#5b6ef5',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>Supported domains</div>
        </div>

        <div style={{ overflow: 'hidden', position: 'relative', padding: '4px 0' }}>
          {/* Fade masks */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
            background: 'linear-gradient(to right, var(--bg, #080b14), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
            background: 'linear-gradient(to left, var(--bg, #080b14), transparent)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', gap: 12,
            transform: `translateX(${-(normalizedPos % (totalWidth + 12 * DOMAINS.length))}px)`,
            width: 'max-content',
            willChange: 'transform',
          }}>
            {marqueeDomains.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100, padding: '10px 20px',
                whiteSpace: 'nowrap', minWidth: 148,
              }}>
                <span style={{ fontSize: 18 }}>{d.emoji}</span>
                <span style={{ fontSize: 13, color: '#a0aabb', fontFamily: 'DM Sans, sans-serif' }}>
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(91,110,245,0.12) 0%, rgba(167,139,250,0.08) 100%)',
        border: '1px solid rgba(91,110,245,0.25)',
        borderRadius: 24, padding: '48px 40px',
        textAlign: 'center',
        animation: 'fadeUp 0.5s ease 0.45s both',
        position: 'relative', overflow: 'hidden',
      }}>
        <Orb style={{ width: 200, height: 200, top: -60, right: -40, background: 'rgba(167,139,250,0.15)' }} />
        <Orb style={{ width: 150, height: 150, bottom: -40, left: -20, background: 'rgba(91,110,245,0.12)' }} />

        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: 28,
          fontWeight: 800, color: '#f0f2ff',
          letterSpacing: '-0.03em', marginBottom: 12,
        }}>Ready to design something great?</div>
        <p style={{ color: '#7a85a3', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
          No account required. No design skills needed.<br />
          Just describe it and watch GenUx build it.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(135deg, #5b6ef5, #a78bfa)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px 36px', fontSize: 15, fontWeight: 700,
            fontFamily: 'Syne, sans-serif', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(91,110,245,0.4)',
            transition: 'all 0.2s ease', letterSpacing: '0.01em',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          ✦ Start Generating
        </button>
      </div>
    </div>
  );
}