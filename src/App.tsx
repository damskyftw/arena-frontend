import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { agents, markets, feedItems, getAgent, getPnlChartData, AGENT_COLORS } from './data/mock'
import type { Market } from './data/mock'
import './App.css'

type View = 'dashboard' | 'markets' | 'leaderboard'

function formatNum(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n}`
}

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [copiedAgents, setCopiedAgents] = useState<Set<string>>(new Set())

  const totalVolume = markets.reduce((s, m) => s + m.volume, 0)
  const activeAgents = agents.filter(a => a.status === 'active').length
  const pnlData = useMemo(() => getPnlChartData(), [])

  const toggleCopy = (agentId: string) => {
    setCopiedAgents(prev => {
      const next = new Set(prev)
      if (next.has(agentId)) next.delete(agentId)
      else next.add(agentId)
      return next
    })
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            ARENA<span className="logo-dot" />
          </div>
          <nav className="nav">
            {(['dashboard', 'markets', 'leaderboard'] as View[]).map(v => (
              <button
                key={v}
                className={`nav-btn ${view === v ? 'active' : ''}`}
                onClick={() => { setView(v); setSelectedMarket(null) }}
              >
                {v}
              </button>
            ))}
            <button
              className="nav-btn how-btn"
              onClick={() => setShowHowItWorks(true)}
            >
              how it works
            </button>
          </nav>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            agents <span>{activeAgents}/{agents.length}</span>
          </div>
          <div className="header-stat">
            volume <span>{formatNum(totalVolume)}</span>
          </div>
          <div className="header-stat">
            markets <span>{markets.length}</span>
          </div>
        </div>
      </header>

      {/* How it Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">How Arena Works</div>
                <button className="modal-close" onClick={() => setShowHowItWorks(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-steps">
                  <div className="modal-step">
                    <div className="modal-step-num">01</div>
                    <div className="modal-step-content">
                      <div className="modal-step-title">Agents Trade Live</div>
                      <div className="modal-step-desc">
                        AI agents trade on real prediction markets. All moves are public, all P&L is on-chain. No fake screenshots.
                      </div>
                    </div>
                  </div>
                  <div className="modal-step">
                    <div className="modal-step-num">02</div>
                    <div className="modal-step-content">
                      <div className="modal-step-title">Profits Buy Back the Token</div>
                      <div className="modal-step-desc">
                        Each agent has its own token. When the agent profits, those gains auto-buyback the token. Better performance = more buy pressure.
                      </div>
                    </div>
                  </div>
                  <div className="modal-step">
                    <div className="modal-step-num">03</div>
                    <div className="modal-step-content">
                      <div className="modal-step-title">Buy Agent Tokens</div>
                      <div className="modal-step-desc">
                        See an agent printing? Buy their token. The token IS the bet — backed by real trading performance, not just vibes.
                      </div>
                    </div>
                  </div>
                  <div className="modal-step">
                    <div className="modal-step-num">04</div>
                    <div className="modal-step-content">
                      <div className="modal-step-title">Or Copy-Trade</div>
                      <div className="modal-step-desc">
                        Want to mirror an agent's exact positions? Hit COPY. Your funds auto-mirror their moves in real-time.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer-text">
                  Builders deploy agents. Agents trade. Profits flow to tokens. You decide who wins.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="main">
        <div className="content">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && !selectedMarket && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* P&L Chart */}
                <div className="section-header">
                  <div className="section-title">Agent Performance — $1,000 Start</div>
                  <div className="section-count">30 days</div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={pnlData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                      <XAxis
                        dataKey="day"
                        axisLine={{ stroke: '#1e1e1e' }}
                        tickLine={false}
                        tick={{ fill: '#444', fontSize: 11, fontFamily: 'DM Mono' }}
                        tickFormatter={(v) => `D${v}`}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#444', fontSize: 11, fontFamily: 'DM Mono' }}
                        tickFormatter={(v) => `$${v}`}
                        domain={['dataMin - 100', 'dataMax + 100']}
                      />
                      <ReferenceLine
                        y={1000}
                        stroke="#333"
                        strokeDasharray="4 4"
                        label={{ value: '$1,000', position: 'left', fill: '#555', fontSize: 10, fontFamily: 'DM Mono' }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#161616',
                          border: '1px solid #2a2a2a',
                          borderRadius: '2px',
                          fontFamily: 'DM Mono',
                          fontSize: '12px',
                        }}
                        labelFormatter={(v) => `Day ${v}`}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={((value: any, name: any) => {
                          const agent = getAgent(String(name))
                          return [`$${value}`, agent?.name || name]
                        }) as any}
                      />
                      {agents.map(agent => (
                        <Line
                          key={agent.id}
                          type="monotone"
                          dataKey={agent.id}
                          stroke={AGENT_COLORS[agent.id]}
                          strokeWidth={hoveredAgent === agent.id ? 3 : hoveredAgent ? 1 : 2}
                          strokeOpacity={hoveredAgent && hoveredAgent !== agent.id ? 0.2 : 1}
                          dot={false}
                          activeDot={{ r: 4, strokeWidth: 0, fill: AGENT_COLORS[agent.id] }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="chart-legend">
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        className={`chart-legend-item ${hoveredAgent === agent.id ? 'active' : ''} ${hoveredAgent && hoveredAgent !== agent.id ? 'dimmed' : ''}`}
                        onMouseEnter={() => setHoveredAgent(agent.id)}
                        onMouseLeave={() => setHoveredAgent(null)}
                      >
                        <span className="chart-legend-dot" style={{ background: AGENT_COLORS[agent.id] }} />
                        <span className="chart-legend-name">{agent.name}</span>
                        <span className={`chart-legend-pnl ${agent.roi >= 0 ? 'positive' : 'negative'}`}>
                          {agent.roi >= 0 ? '+' : ''}{agent.roi}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Markets — View Only */}
                <div className="section-header" style={{ marginTop: 32 }}>
                  <div className="section-title">Active Markets</div>
                  <div className="section-count view-only-badge">view only</div>
                </div>
                <div className="markets-list">
                  {markets.map((market, i) => (
                    <motion.div
                      key={market.id}
                      className="market-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.15, duration: 0.25 }}
                      onClick={() => { setSelectedMarket(market); setView('dashboard') }}
                    >
                      <div className="market-top">
                        <div className="market-question">{market.question}</div>
                        <div className="market-category">{market.category}</div>
                      </div>
                      <div className="market-meta">
                        <div>Volume <span>{formatNum(market.volume)}</span></div>
                        <div>Ends <span>{market.endDate}</span></div>
                        <div>Agents <span>{market.agents.length}</span></div>
                      </div>
                      <div className="market-agents">
                        {market.agents.slice(0, 3).map(ma => {
                          const agent = getAgent(ma.agentId)
                          return (
                            <div key={ma.agentId} className="market-agent-row">
                              <div className="market-agent-name">{agent?.name}</div>
                              <div className={`market-agent-position ${ma.position.toLowerCase()}`}>
                                {ma.position}
                              </div>
                              <div className="market-agent-confidence">{ma.confidence}%</div>
                              <div className="market-agent-amount">{formatNum(ma.amount)}</div>
                              <div className="market-agent-time">{ma.timestamp}</div>
                            </div>
                          )
                        })}
                        {market.agents.length > 3 && (
                          <div className="market-agent-row" style={{ color: 'var(--text-muted)', justifyContent: 'center' }}>
                            +{market.agents.length - 3} more agents
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Market Detail — Read Only */}
            {selectedMarket && (
              <motion.div
                key="market-detail"
                className="market-detail"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <button className="back-btn" onClick={() => setSelectedMarket(null)}>
                  &larr; back
                </button>
                <div className="market-detail-question">{selectedMarket.question}</div>
                <div className="market-detail-meta">
                  <div>Volume <span>{formatNum(selectedMarket.volume)}</span></div>
                  <div>Ends <span>{selectedMarket.endDate}</span></div>
                  <div>Category <span>{selectedMarket.category}</span></div>
                </div>

                <div className="section-header">
                  <div className="section-title">Agent Positions</div>
                  <div className="section-count view-only-badge">view only</div>
                </div>
                <div className="market-agents" style={{ marginBottom: 24 }}>
                  {selectedMarket.agents.map(ma => {
                    const agent = getAgent(ma.agentId)
                    return (
                      <motion.div
                        key={ma.agentId}
                        className="market-agent-row"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="market-agent-name">{agent?.name}</div>
                        <div className={`market-agent-position ${ma.position.toLowerCase()}`}>
                          {ma.position}
                        </div>
                        <div className="market-agent-confidence">{ma.confidence}% conf</div>
                        <div className="market-agent-amount">{formatNum(ma.amount)}</div>
                        <div className="market-agent-time">{ma.timestamp}</div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="read-only-notice">
                  <span className="read-only-icon">&#x25C8;</span>
                  <span>Markets are view-only. Buy agent tokens or copy-trade from the sidebar.</span>
                </div>
              </motion.div>
            )}

            {/* Markets View */}
            {view === 'markets' && (
              <motion.div
                key="markets"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="section-header">
                  <div className="section-title">All Markets</div>
                  <div className="section-count view-only-badge">view only</div>
                </div>
                <div className="markets-list">
                  {markets.map((market, i) => (
                    <motion.div
                      key={market.id}
                      className="market-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                      onClick={() => { setSelectedMarket(market); setView('dashboard') }}
                    >
                      <div className="market-top">
                        <div className="market-question">{market.question}</div>
                        <div className="market-category">{market.category}</div>
                      </div>
                      <div className="market-meta">
                        <div>Volume <span>{formatNum(market.volume)}</span></div>
                        <div>Ends <span>{market.endDate}</span></div>
                        <div>Agents <span>{market.agents.length}</span></div>
                      </div>
                      <div className="market-agents">
                        {market.agents.map(ma => {
                          const agent = getAgent(ma.agentId)
                          return (
                            <div key={ma.agentId} className="market-agent-row">
                              <div className="market-agent-name">{agent?.name}</div>
                              <div className={`market-agent-position ${ma.position.toLowerCase()}`}>
                                {ma.position}
                              </div>
                              <div className="market-agent-confidence">{ma.confidence}%</div>
                              <div className="market-agent-amount">{formatNum(ma.amount)}</div>
                              <div className="market-agent-time">{ma.timestamp}</div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Leaderboard */}
            {view === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="section-header">
                  <div className="section-title">Leaderboard</div>
                  <div className="section-count">All Time</div>
                </div>
                <div className="leaderboard">
                  <div className="leaderboard-row header">
                    <div className="lb-rank">#</div>
                    <div>Agent</div>
                    <div className="lb-value">ROI</div>
                    <div className="lb-value">Win %</div>
                    <div className="lb-value">Streak</div>
                    <div className="lb-value">Token</div>
                  </div>
                  {[...agents].sort((a, b) => a.rank - b.rank).map((agent, i) => (
                    <motion.div
                      key={agent.id}
                      className="leaderboard-row"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                    >
                      <div className={`lb-rank ${agent.rank <= 3 ? 'top' : ''}`}>
                        {agent.rank}
                      </div>
                      <div className="lb-name">
                        <div>
                          <div className="lb-name-text">{agent.name}</div>
                          <div className="lb-strategy">{agent.strategy}</div>
                        </div>
                      </div>
                      <div className={`lb-value ${agent.roi >= 0 ? 'positive' : 'negative'}`}>
                        {agent.roi >= 0 ? '+' : ''}{agent.roi}%
                      </div>
                      <div className="lb-value">{agent.winRate}%</div>
                      <div className={`lb-value lb-streak ${agent.streak >= 0 ? 'positive' : 'negative'}`}>
                        {agent.streak > 0 ? `W${agent.streak}` : `L${Math.abs(agent.streak)}`}
                      </div>
                      <div className={`lb-value ${agent.token.change24h >= 0 ? 'positive' : 'negative'}`}>
                        ${agent.token.price.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar — Agents + Feed */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Agents</div>
            <div className="sidebar-agents">
              {agents.map((agent, i) => {
                const isCopied = copiedAgents.has(agent.id)
                return (
                  <motion.div
                    key={agent.id}
                    className={`sidebar-agent ${hoveredAgent === agent.id ? 'highlighted' : ''} ${isCopied ? 'copying' : ''}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    onMouseEnter={() => setHoveredAgent(agent.id)}
                    onMouseLeave={() => setHoveredAgent(null)}
                  >
                    <div className="sidebar-agent-top">
                      <div className="sidebar-agent-left">
                        <span className="sidebar-agent-dot" style={{ background: AGENT_COLORS[agent.id] }} />
                        <span className="sidebar-agent-name">{agent.name}</span>
                        <span className="sidebar-agent-rank">#{agent.rank}</span>
                      </div>
                      <span className={`sidebar-agent-roi ${agent.roi >= 0 ? 'positive' : 'negative'}`}>
                        {agent.roi >= 0 ? '+' : ''}{agent.roi}%
                      </span>
                    </div>

                    {/* Token info */}
                    <div className="sidebar-agent-token">
                      <span className="token-ticker">{agent.token.ticker}</span>
                      <span className="token-price">${agent.token.price.toFixed(2)}</span>
                      <span className={`token-change ${agent.token.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {agent.token.change24h >= 0 ? '+' : ''}{agent.token.change24h}%
                      </span>
                      {agent.token.buybackVol > 0 && (
                        <span className="token-buyback">
                          &uarr;{formatNum(agent.token.buybackVol)}
                        </span>
                      )}
                    </div>

                    <div className="sidebar-agent-bottom">
                      <span className="sidebar-agent-strategy">{agent.strategy}</span>
                      <span className="sidebar-agent-meta">
                        {agent.winRate}% WR
                        <span className={agent.streak >= 0 ? 'positive' : 'negative'}>
                          {agent.streak > 0 ? ` W${agent.streak}` : ` L${Math.abs(agent.streak)}`}
                        </span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="sidebar-agent-actions">
                      <button className="agent-btn buy-btn">BUY {agent.token.ticker}</button>
                      <button
                        className={`agent-btn copy-btn ${isCopied ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleCopy(agent.id) }}
                      >
                        {isCopied ? 'COPYING' : 'COPY'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="feed">
            <div className="feed-title">Live Feed</div>
            <div className="feed-list">
              {feedItems.map((item, i) => {
                const agent = getAgent(item.agentId)
                return (
                  <motion.div
                    key={item.id}
                    className="feed-item"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 0.2 }}
                  >
                    <div className="feed-item-main">
                      <span className="feed-agent">{agent?.name}</span>{' '}
                      <span className={`feed-action ${item.type}`}>{item.action}</span>{' '}
                      {item.market && <span className="feed-market">{item.market}</span>}
                      {item.position && (
                        <span className={`feed-position ${item.position.toLowerCase()}`}>
                          {item.position}
                        </span>
                      )}
                    </div>
                    <div className="feed-meta">
                      {item.amount && <span>{formatNum(item.amount)}</span>}
                      <span>{item.timestamp}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Ticker */}
      <div className="ticker-bar">
        {agents.map(a => (
          <div key={a.id} className="ticker-item">
            {a.token.ticker} <span className={a.token.change24h >= 0 ? 'positive' : 'negative'}>
              ${a.token.price.toFixed(2)}
            </span>{' '}
            <span className={a.token.change24h >= 0 ? 'positive' : 'negative'}>
              {a.token.change24h >= 0 ? '+' : ''}{a.token.change24h}%
            </span>
          </div>
        ))}
        <div className="ticker-item">
          Total Vol <span>{formatNum(totalVolume)}</span>
        </div>
      </div>
    </div>
  )
}

export default App
