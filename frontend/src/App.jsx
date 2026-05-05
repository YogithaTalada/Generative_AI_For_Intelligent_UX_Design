import React, { useState, useRef } from 'react';
import './App.css';
import PromptInput from './components/PromptInput';
import LayoutResults from './components/LayoutResults';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isDark, setIsDark] = useState(true); // 👈 NEW: theme state
  const isGenerating = useRef(false);

  const theme = isDark ? {
    '--bg': '#080b14',
    '--surface': '#0f1624',
    '--surface2': '#161d2e',
    '--border': 'rgba(255,255,255,0.08)',
    '--accent': '#5b6ef5',
    '--accent2': '#a78bfa',
    '--text': '#f0f2ff',
    '--text-muted': '#7a85a3',
    '--glow': 'rgba(91, 110, 245, 0.3)',
  } : {
    '--bg': '#f4f6fb',
    '--surface': '#ffffff',
    '--surface2': '#eef1f8',
    '--border': 'rgba(0,0,0,0.08)',
    '--accent': '#5b6ef5',
    '--accent2': '#7c3aed',
    '--text': '#0f1624',
    '--text-muted': '#5a6480',
    '--glow': 'rgba(91, 110, 245, 0.15)',
  };

  const handleGenerate = async (userPrompt) => {
    if (isGenerating.current) return;
    isGenerating.current = true;

    setLoading(true);
    setError('');
    setResults(null);
    setPrompt(userPrompt);

    try {
      const response = await axios.post('/generate', {
        prompt: userPrompt,
        layout_type: 'web app',
      }, { timeout: 180000 });
      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Something went wrong. Make sure your backend is running and Groq API key is set.'
      );
    } finally {
      setLoading(false);
      isGenerating.current = false;
    }
  };

  const handleReset = () => {
    setResults(null);
    setError('');
    setPrompt('');
  };

  return (
    <div className="app-wrapper" style={theme}>
      <div className="bg-grid" />
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {/* 👇 Pass isDark and toggle down to Header */}
      <Header isDark={isDark} onToggleTheme={() => setIsDark(d => !d)} />

      <main className="main-content">
        {!results && !loading && (
          <PromptInput onGenerate={handleGenerate} error={error} />
        )}
        {loading && <LoadingScreen />}
        {results && !loading && (
          <LayoutResults results={results} prompt={prompt} onReset={handleReset} />
        )}
      </main>

      <Footer />

      <style>{`
        .app-wrapper {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--bg);
          color: var(--text);
          transition: background 0.3s ease, color 0.3s ease;
        }
        .bg-grid {
          position: fixed; inset: 0;
          background-image: linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none; z-index: 0;
        }
        .bg-glow-1 { position: fixed; top: -200px; left: -200px; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(91,110,245,0.15) 0%, transparent 70%);
          pointer-events: none; z-index: 0; }
        .bg-glow-2 { position: fixed; bottom: -200px; right: -200px; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0; }
        .main-content { position: relative; z-index: 1; padding: 0 24px 60px; }
      `}</style>
    </div>
  );
}

export default App;