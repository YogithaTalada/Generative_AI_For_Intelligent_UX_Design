import React, { useEffect, useState } from 'react';

const MESSAGES = [
  'Analyzing your prompt with AI...',
  'Crafting Layout 1 color palette...',
  'Designing Layout 2 typography system...',
  'Generating visual HTML previews...',
  'Finalizing design recommendations...',
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 2400);
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + 1, 92));
    }, 140);
    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div style={{
      maxWidth: 500,
      margin: '120px auto 0',
      textAlign: 'center',
      animation: 'fadeUp 0.5s ease both',
    }}>
      {/* Spinner */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '2px solid rgba(91,110,245,0.2)',
        borderTop: '2px solid #5b6ef5',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 32px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 8,
          borderRadius: '50%',
          border: '2px solid rgba(167,139,250,0.15)',
          borderBottom: '2px solid #a78bfa',
          animation: 'spin 1.5s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute',
          inset: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 20,
        }}>✦</div>
      </div>

      <h2 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 12,
        color: '#f0f2ff',
      }}>Generating Your Layouts</h2>

      <p style={{
        color: '#7a85a3',
        fontSize: 15,
        marginBottom: 40,
        minHeight: 24,
        transition: 'opacity 0.3s ease',
      }}>{MESSAGES[msgIndex]}</p>

      {/* Progress Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 100,
        height: 4,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #5b6ef5, #a78bfa)',
          borderRadius: 100,
          width: `${progress}%`,
          transition: 'width 0.14s linear',
        }} />
      </div>
      <div style={{ fontSize: 12, color: '#7a85a3' }}>{progress}% complete</div>

      {/* Steps */}
      <div style={{
        marginTop: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        textAlign: 'left',
      }}>
        {MESSAGES.slice(0, 4).map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderRadius: 10,
            background: i <= msgIndex ? 'rgba(91,110,245,0.08)' : 'transparent',
            border: `1px solid ${i <= msgIndex ? 'rgba(91,110,245,0.2)' : 'transparent'}`,
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: i < msgIndex ? '#22c55e' : i === msgIndex ? '#5b6ef5' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, flexShrink: 0,
              transition: 'all 0.3s ease',
            }}>
              {i < msgIndex ? '✓' : i === msgIndex ? '◉' : '○'}
            </div>
            <span style={{ fontSize: 13, color: i <= msgIndex ? '#c4c9e2' : '#7a85a3' }}>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
