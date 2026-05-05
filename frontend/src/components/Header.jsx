import React, { useState } from 'react';

export default function Header({ isDark, onToggleTheme }) {
  const [hovered, setHovered] = useState(false);

  return (
    <header style={{
      position: 'relative', zIndex: 10, padding: '20px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
      backdropFilter: 'blur(12px)',
      background: isDark ? 'rgba(8,11,20,0.6)' : 'rgba(255,255,255,0.7)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #5b6ef5, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, animation: 'float 3s ease-in-out infinite',
        }}>✦</div>
        <div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18,
            color: isDark ? '#f0f2ff' : '#0f1624',
            letterSpacing: '-0.02em',
            transition: 'color 0.3s ease',
          }}>
            GenUx
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#7a85a3' : '#5a6480', letterSpacing: '0.08em' }}>
            POWERED BY DATA SCIENCE STUDENTS
          </div>
        </div>
      </div>

      {/* Right side: AI status + theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* AI Online badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 12, color: isDark ? '#7a85a3' : '#5a6480' }}>AI Online</span>
        </div>

        {/* 👇 Dark/Light Toggle Button */}
        <button
          onClick={onToggleTheme}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 14px',
            borderRadius: 100,
            border: isDark
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(0,0,0,0.12)',
            background: hovered
              ? isDark ? 'rgba(91,110,245,0.2)' : 'rgba(91,110,245,0.1)'
              : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: isDark ? '#c4c9e2' : '#3b4261',
            fontSize: 13,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
        >
          {/* Toggle Track */}
          <div style={{
            width: 34,
            height: 18,
            borderRadius: 100,
            background: isDark
              ? 'linear-gradient(135deg, #5b6ef5, #a78bfa)'
              : 'rgba(0,0,0,0.15)',
            position: 'relative',
            flexShrink: 0,
            transition: 'background 0.3s ease',
          }}>
            <div style={{
              position: 'absolute',
              top: 3,
              left: isDark ? 17 : 3,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
          <span style={{ fontSize: 15 }}>{isDark ? '🌙' : '☀️'}</span>
          <span>{isDark ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}