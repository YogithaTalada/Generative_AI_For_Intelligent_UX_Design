import React, { useState, useEffect } from 'react';

export default function LayoutCard({ layout, index, activeTab }) {
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Lock body scroll when fullscreen open
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!layout) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(layout.html_preview || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([layout.html_preview || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layout-${index}-${layout.title?.toLowerCase().replace(/\s+/g, '-') || 'design'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenTab = () => {
    const blob = new Blob([layout.html_preview || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const cp = layout.color_palette || {};
  const typo = layout.typography || {};
  const sections = layout.sections || [];

  const btnBase = {
    border: 'none', borderRadius: 8, padding: '6px 13px',
    fontSize: 12, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s ease',
  };

  return (
    <>
      {/* ── FULLSCREEN MODAL ── */}
      {fullscreen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(4,6,14,0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeUp 0.2s ease both',
          }}
        >
          {/* Modal top bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: 'rgba(15,22,36,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}>
            {/* Left: title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: `linear-gradient(135deg, ${cp.primary || '#5b6ef5'}, ${cp.accent || '#a78bfa'})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0,
              }}>{index}</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f2ff' }}>
                  {layout.title || `Layout ${index}`}
                </div>
                <div style={{ fontSize: 11, color: '#7a85a3' }}>{layout.style || ''}</div>
              </div>
            </div>

            {/* Center: fake browser bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, color: '#7a85a3',
              minWidth: 200, justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10 }}>🔒</span>
              genux-preview.localhost
            </div>

            {/* Right: actions */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={handleCopy} style={{
                ...btnBase,
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: copied ? '#86efac' : '#a0aabb',
              }}>{copied ? '✓ Copied' : '⎘ Copy HTML'}</button>

              <button onClick={handleDownload} style={{
                ...btnBase,
                background: 'rgba(91,110,245,0.15)',
                border: '1px solid rgba(91,110,245,0.3)',
                color: '#a78bfa',
              }}>↓ Download</button>

              <button onClick={handleOpenTab} style={{
                ...btnBase,
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(56,189,248,0.25)',
                color: '#7dd3fc',
              }}>↗ New Tab</button>

              <button
                onClick={() => setFullscreen(false)}
                title="Close fullscreen (Esc)"
                style={{
                  ...btnBase,
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fca5a5',
                  padding: '6px 11px',
                  fontSize: 16, lineHeight: 1,
                }}
              >✕</button>
            </div>
          </div>

          {/* iframe fills remaining space */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <iframe
              key={`fs-${iframeKey}`}
              srcDoc={layout.html_preview}
              title={`Fullscreen Layout ${index}`}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              sandbox="allow-same-origin"
            />
          </div>

          {/* Bottom hint bar */}
          <div style={{
            padding: '7px 20px',
            background: 'rgba(15,22,36,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: 11, color: '#4b5563', textAlign: 'center', flexShrink: 0,
          }}>
            Press{' '}
            <kbd style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 4,
              padding: '1px 5px', color: '#7a85a3', fontFamily: 'monospace',
            }}>Esc</kbd>
            {' '}or click the backdrop to exit fullscreen
          </div>
        </div>
      )}

      {/* ── CARD ── */}
      <div style={{
        background: 'rgba(15,22,36,0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Card Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `linear-gradient(135deg, ${cp.primary || '#5b6ef5'}, ${cp.accent || '#a78bfa'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#fff', fontWeight: 700,
            }}>{index}</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f2ff' }}>
                {layout.title || `Layout ${index}`}
              </div>
              <div style={{ fontSize: 11, color: '#7a85a3', marginTop: 1 }}>{layout.style || ''}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={handleCopy} style={{
              ...btnBase,
              background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: copied ? '#86efac' : '#a0aabb',
            }}>{copied ? '✓ Copied' : '⎘ HTML'}</button>

            <button onClick={handleDownload} style={{
              ...btnBase,
              background: 'rgba(91,110,245,0.15)',
              border: '1px solid rgba(91,110,245,0.3)',
              color: '#a78bfa',
            }}>↓ Save</button>

            {activeTab === 'preview' && (
              <button
                onClick={() => setFullscreen(true)}
                title="Open fullscreen"
                style={{
                  ...btnBase,
                  background: 'rgba(56,189,248,0.1)',
                  border: '1px solid rgba(56,189,248,0.25)',
                  color: '#7dd3fc',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M1 4.5V1H4.5M7.5 1H11V4.5M11 7.5V11H7.5M4.5 11H1V7.5"
                    stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Fullscreen
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: activeTab === 'preview' ? 0 : '22px', flex: 1 }}>

          {/* PREVIEW */}
          {activeTab === 'preview' && (
            <div style={{ position: 'relative' }}>
              {layout.html_preview ? (
                <iframe
                  key={iframeKey}
                  srcDoc={layout.html_preview}
                  title={`Layout ${index} Preview`}
                  style={{ width: '100%', height: 520, border: 'none', display: 'block' }}
                  sandbox="allow-scripts"
                />
              ) : (
                <div style={{
                  height: 520, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#7a85a3',
                  fontSize: 14, flexDirection: 'column', gap: 8,
                }}>
                  <span style={{ fontSize: 32 }}>🖼</span>
                  <span>No preview available</span>
                </div>
              )}

              {/* Overlay badges */}
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
                borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#c4c9e2',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>Live Preview</div>

              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setIframeKey(k => k + 1)}
                  title="Reload"
                  style={{
                    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
                    borderRadius: 6, padding: '4px 9px', fontSize: 11, color: '#c4c9e2',
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                  }}
                >↻</button>
                <button
                  onClick={() => setFullscreen(true)}
                  title="Fullscreen"
                  style={{
                    background: 'rgba(56,189,248,0.2)', backdropFilter: 'blur(8px)',
                    borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#7dd3fc',
                    border: '1px solid rgba(56,189,248,0.3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M1 4.5V1H4.5M7.5 1H11V4.5M11 7.5V11H7.5M4.5 11H1V7.5"
                      stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Fullscreen
                </button>
              </div>
            </div>
          )}

          {/* COLORS */}
          {activeTab === 'colors' && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f2ff' }}>
                  {cp.name || 'Color Palette'}
                </div>
                <div style={{ fontSize: 12, color: '#7a85a3', marginTop: 4 }}>Mood: {cp.mood || '—'}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }}>
                {[
                  { label: 'Primary', key: 'primary' },
                  { label: 'Secondary', key: 'secondary' },
                  { label: 'Accent', key: 'accent' },
                  { label: 'Background', key: 'background' },
                  { label: 'Surface', key: 'surface' },
                  { label: 'Text Primary', key: 'text_primary' },
                  { label: 'Text Secondary', key: 'text_secondary' },
                ].map(({ label, key }) => cp[key] && (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 10, padding: '10px 12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: cp[key], border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#a0aabb' }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#f0f2ff', fontWeight: 600, fontFamily: 'monospace' }}>{cp[key]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', height: 40 }}>
                {[cp.primary, cp.secondary, cp.accent, cp.background, cp.surface].filter(Boolean).map((color, i) => (
                  <div key={i} style={{ flex: 1, background: color }} title={color} />
                ))}
              </div>
            </div>
          )}

          {/* TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Heading Font', value: typo.heading_font },
                { label: 'Body Font', value: typo.body_font },
                { label: 'Heading Size', value: typo.heading_size },
                { label: 'Body Size', value: typo.body_size },
                { label: 'Line Height', value: typo.line_height },
                { label: 'Font Weight', value: typo.font_weight_heading },
                { label: 'Letter Spacing', value: typo.letter_spacing },
              ].map(({ label, value }) => value && (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 12, color: '#7a85a3' }}>{label}</span>
                  <span style={{ fontSize: 13, color: '#f0f2ff', fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
              {typo.style_notes && (
                <div style={{
                  background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)',
                  borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#c4c9e2', lineHeight: 1.6,
                }}>
                  <strong style={{ color: '#a78bfa' }}>Style Notes:</strong> {typo.style_notes}
                </div>
              )}
            </div>
          )}

          {/* SECTIONS */}
          {activeTab === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {layout.description && (
                <div style={{
                  background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)',
                  borderRadius: 10, padding: '12px 14px',
                  fontSize: 13, color: '#c4c9e2', lineHeight: 1.6, marginBottom: 2,
                }}>{layout.description}</div>
              )}
              {sections.map((section, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: 'rgba(91,110,245,0.2)',
                    border: '1px solid rgba(91,110,245,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#a78bfa', fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#f0f2ff' }}>{section.name}</span>
                      <span style={{
                        background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
                        borderRadius: 100, padding: '1px 7px', fontSize: 10, color: '#a78bfa',
                      }}>{section.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#7a85a3', marginBottom: 3 }}>{section.content}</div>
                    {section.layout_hint && (
                      <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace' }}>📐 {section.layout_hint}</div>
                    )}
                  </div>
                </div>
              ))}
              {layout.target_audience && (
                <div style={{
                  display: 'flex', gap: 8, padding: '10px 14px',
                  background: 'rgba(34,197,94,0.06)', borderRadius: 10,
                  border: '1px solid rgba(34,197,94,0.15)', fontSize: 12, color: '#86efac',
                }}>
                  <span>👥</span><span><strong>Audience:</strong> {layout.target_audience}</span>
                </div>
              )}
              {layout.unique_feature && (
                <div style={{
                  display: 'flex', gap: 8, padding: '10px 14px',
                  background: 'rgba(251,191,36,0.06)', borderRadius: 10,
                  border: '1px solid rgba(251,191,36,0.15)', fontSize: 12, color: '#fde68a',
                }}>
                  <span>⚡</span><span><strong>Unique:</strong> {layout.unique_feature}</span>
                </div>
              )}
              {layout.design_principles?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                  {layout.design_principles.map((p, i) => (
                    <span key={i} style={{
                      background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.25)',
                      borderRadius: 100, padding: '4px 10px', fontSize: 11, color: '#818cf8',
                    }}>{p}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}