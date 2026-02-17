import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { agents, markets, feedItems, bettingPools, getAgent, getPnlChartData, AGENT_COLORS } from './data/mock'
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

  const totalVolume = markets.reduce((s, m) => s + m.volume, 0)
  const activeAgents = agents.filter(a => a.status === 'active').length
  const pnlData = useMemo(() => getPnlChartData(), [])

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

                {/* Active Markets */}
                <div className="section-header" style={{ marginTop: 32 }}>
                  <div className="section-title">Active Markets</div>
                  <div className="section-count">{markets.length}</div>
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

            {/* Market Detail */}
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

                {(() => {
                  const pools = bettingPools.filter(p => p.marketId === selectedMarket.id)
                  if (pools.length === 0) return null
                  return (
                    <div className="bet-section" style={{ borderTop: 'none', marginTop: 0 }}>
                      <div className="bet-header">Meta-Bet Pools</div>
                      <div className="bet-pools">
                        {pools.map(pool => {
                          const agent = getAgent(pool.agentId)
                          const total = pool.yesPool + pool.noPool
                          const yesPct = Math.round((pool.yesPool / total) * 100)
                          return (
                            <div key={pool.agentId} className="bet-pool-row">
                              <div className="bet-pool-agent">{agent?.name}</div>
                              <div className="bet-pool-bar">
                                <div className="bet-pool-yes" style={{ width: `${yesPct}%` }}>
                                  {formatNum(pool.yesPool)}
                                </div>
                                <div className="bet-pool-no" style={{ width: `${100 - yesPct}%` }}>
                                  {formatNum(pool.noPool)}
                                </div>
                              </div>
                              <div className="bet-pool-bettors">{pool.totalBettors}</div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="bet-buttons">
                        <button className="bet-btn yes">BET YES</button>
                        <button className="bet-btn no">BET NO</button>
                      </div>
                    </div>
                  )
                })()}
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
                  <div className="section-count">{markets.length}</div>
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

                      {(() => {
                        const pools = bettingPools.filter(p => p.marketId === market.id)
                        if (pools.length === 0) return null
                        return (
                          <div className="bet-section">
                            <div className="bet-header">Meta-Bet Pools</div>
                            <div className="bet-pools">
                              {pools.map(pool => {
                                const a = getAgent(pool.agentId)
                                const total = pool.yesPool + pool.noPool
                                const yesPct = Math.round((pool.yesPool / total) * 100)
                                return (
                                  <div key={pool.agentId} className="bet-pool-row">
                                    <div className="bet-pool-agent">{a?.name}</div>
                                    <div className="bet-pool-bar">
                                      <div className="bet-pool-yes" style={{ width: `${yesPct}%` }}>
                                        {formatNum(pool.yesPool)}
                                      </div>
                                      <div className="bet-pool-no" style={{ width: `${100 - yesPct}%` }}>
                                        {formatNum(pool.noPool)}
                                      </div>
                                    </div>
                                    <div className="bet-pool-bettors">{pool.totalBettors}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}
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
                    <div className="lb-value">P&L</div>
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
                      <div className={`lb-value ${agent.pnl >= 0 ? 'positive' : 'negative'}`}>
                        {agent.pnl >= 0 ? '+' : ''}{formatNum(agent.pnl)}
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
            <div className="sidebar-title">Active Agents</div>
            <div className="sidebar-agents">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  className={`sidebar-agent ${hoveredAgent === agent.id ? 'highlighted' : ''}`}
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
                  <div className="sidebar-agent-bottom">
                    <span className="sidebar-agent-strategy">{agent.strategy}</span>
                    <span className="sidebar-agent-meta">
                      {agent.winRate}% WR
                      <span className={agent.streak >= 0 ? 'positive' : 'negative'}>
                        {agent.streak > 0 ? ` W${agent.streak}` : ` L${Math.abs(agent.streak)}`}
                      </span>
                    </span>
                  </div>
                  <div className="sidebar-agent-status">
                    <span className={`status-dot ${agent.status}`} />
                    {agent.status}
                  </div>
                </motion.div>
              ))}
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
            {a.name} <span className={a.roi >= 0 ? 'positive' : 'negative'}>
              {a.roi >= 0 ? '+' : ''}{a.roi}%
            </span>
          </div>
        ))}
        <div className="ticker-item">
          Total Vol <span>{formatNum(totalVolume)}</span>
        </div>
        <div className="ticker-item">
          Active Markets <span>{markets.length}</span>
        </div>
      </div>
    </div>
  )
}

export default App
