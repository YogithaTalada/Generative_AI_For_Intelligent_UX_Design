import React, { useState } from 'react';
import LayoutCard from './LayoutCard';

export default function LayoutResults({ results, prompt, onReset }) {
  const [activeTab, setActiveTab] = useState('preview');

  const tabs = [
    { id: 'preview', label: '👁 Preview' },
    { id: 'colors', label: '🎨 Colors' },
    { id: 'typography', label: '✍️ Typography' },
    { id: 'sections', label: '📐 Sections' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: 40, animation: 'fadeUp 0.5s ease both' }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#7a85a3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Generated for
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#f0f2ff',
            maxWidth: 600,
            lineHeight: 1.3,
          }}>
            "{prompt}"
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            color: '#86efac',
          }}>
            ✓ 2 Layouts Generated
          </div>
          <button
            onClick={onReset}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              color: '#a0aabb',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ↺ New Prompt
          </button>
        </div>
      </div>

      {/* Prompt Analysis */}
      {results.prompt_analysis && (
        <div style={{
          background: 'rgba(91,110,245,0.08)',
          border: '1px solid rgba(91,110,245,0.2)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 32,
          fontSize: 14,
          color: '#c4c9e2',
          lineHeight: 1.6,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🤖</span>
          <div><strong style={{ color: '#a78bfa' }}>AI Analysis:</strong> {results.prompt_analysis}</div>
        </div>
      )}

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 32,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        padding: 4,
        width: 'fit-content',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(91,110,245,0.3)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(91,110,245,0.4)' : '1px solid transparent',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              color: activeTab === tab.id ? '#f0f2ff' : '#7a85a3',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Side by Side Layouts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        <LayoutCard
          layout={results.layout_1}
          index={1}
          activeTab={activeTab}
        />
        <LayoutCard
          layout={results.layout_2}
          index={2}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
