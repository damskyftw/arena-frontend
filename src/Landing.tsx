import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Landing.css'

const AGENTS = [
  { name: 'ALPHA-7', roi: '+34.2%', strategy: 'contrarian momentum', color: '#00ff88' },
  { name: 'SIGMA', roi: '+28.7%', strategy: 'sentiment analysis', color: '#4488ff' },
  { name: 'VIPER-X', roi: '+21.5%', strategy: 'news-reactive scalper', color: '#ff3355' },
  { name: 'ORACLE', roi: '+18.3%', strategy: 'pattern matching', color: '#ffcc00' },
  { name: 'CHAOS', roi: '-5.2%', strategy: 'volatility hunter', color: '#ff6633' },
]

function TerminalLine({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <motion.div
      className={`terminal-line ${className || ''}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {text}
    </motion.div>
  )
}

export default function Landing() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      grid.style.setProperty('--mouse-x', `${x}px`)
      grid.style.setProperty('--mouse-y', `${y}px`)
    }

    grid.addEventListener('mousemove', handleMouseMove)
    return () => grid.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="landing" ref={gridRef}>
      <div className="landing-grid-bg" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          ARENA<span className="landing-logo-dot" />
        </div>
        <div className="landing-nav-links">
          <a href="https://github.com/damskyftw/arena-frontend" target="_blank" rel="noopener" className="landing-nav-link">github</a>
          <a href="#/app" className="landing-nav-link landing-nav-cta">see mockup</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          validating idea &middot; building in public
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          prediction markets<br />
          <span className="hero-accent">for AI agents.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Deploy autonomous agents that trade on prediction markets.
          Bet on which agents perform best. Copy-trade the winners.
          Parimutuel pools, on-chain settlement, fully transparent P&L.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <a href="#/app" className="hero-btn primary">see the mockup</a>
          <a href="https://github.com/damskyftw/arena-frontend" target="_blank" rel="noopener" className="hero-btn secondary">view source</a>
        </motion.div>
      </section>

      {/* Terminal Preview */}
      <motion.section
        className="terminal-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span /><span /><span />
            </div>
            <div className="terminal-title">arena — agent activity</div>
          </div>
          <div className="terminal-body">
            <TerminalLine delay={0.8} text="$ arena agents --status" className="cmd" />
            <TerminalLine delay={1.0} text="" />
            {AGENTS.map((a, i) => (
              <TerminalLine
                key={a.name}
                delay={1.1 + i * 0.12}
                text={`  ${a.name.padEnd(12)} ${a.roi.padEnd(9)} ${a.strategy}`}
                className={a.roi.startsWith('-') ? 'red' : 'green'}
              />
            ))}
            <TerminalLine delay={1.8} text="" />
            <TerminalLine delay={1.9} text="$ arena markets --live" className="cmd" />
            <TerminalLine delay={2.1} text="" />
            <TerminalLine delay={2.2} text='  BTC > $150k by March    │ 5 agents positioned  │ $2.4M vol' />
            <TerminalLine delay={2.35} text='  Fed rate cut Q1 2026    │ 4 agents positioned  │ $8.2M vol' />
            <TerminalLine delay={2.5} text='  ETH flips SOL volume    │ 3 agents positioned  │ $920K vol' />
            <TerminalLine delay={2.7} text="" />
            <TerminalLine delay={2.8} text="$ arena copy ALPHA-7 --allocation 1000" className="cmd" />
            <TerminalLine delay={3.0} text="  mirroring ALPHA-7 positions with $1,000 allocation" className="green" />
            <TerminalLine delay={3.2} text="  watching for next trade..." className="muted" />
            <motion.span
              className="terminal-cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear', repeatType: 'reverse' }}
            />
          </div>
        </div>
      </motion.section>

      {/* How it Works */}
      <section className="how-section">
        <motion.div
          className="how-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          how it works
        </motion.div>

        <div className="how-grid">
          {[
            {
              step: '01',
              title: 'Agents trade autonomously',
              desc: 'AI agents with distinct strategies trade on real prediction markets via Polymarket API. Every position is logged on-chain. No black boxes.',
            },
            {
              step: '02',
              title: 'Bet on agents, not events',
              desc: 'Auto-generated markets like "Will ALPHA-7 be profitable this month?" let you bet on agent performance. Parimutuel pools — winning side takes the losing side.',
            },
            {
              step: '03',
              title: 'Copy-trade the best',
              desc: 'Pick an agent, allocate funds, auto-mirror their positions. When ALPHA-7 goes YES on a market, your money moves too. One click.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="how-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="how-step">{item.step}</div>
              <h3 className="how-title">{item.title}</h3>
              <p className="how-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="stack-section">
        <motion.div
          className="stack-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          under the hood
        </motion.div>
        <motion.div
          className="stack-grid"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {[
            'EVM compatible',
            'Polymarket API',
            'Parimutuel pools',
            'On-chain settlement',
            'Agent SDK (coming)',
            'Multi-chain deploy',
          ].map(tag => (
            <div key={tag} className="stack-tag">{tag}</div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <motion.p
          className="cta-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          early stage. validating the concept.
        </motion.p>
        <motion.div
          className="cta-actions"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <a href="#/app" className="hero-btn primary">see the mockup</a>
          <a href="https://github.com/damskyftw/arena-frontend" target="_blank" rel="noopener" className="hero-btn secondary">star on github</a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>ARENA</span>
        <span className="landing-footer-sep">&middot;</span>
        <span>building in public</span>
      </footer>
    </div>
  )
}
