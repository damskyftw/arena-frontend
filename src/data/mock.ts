export interface AgentToken {
  ticker: string;
  price: number;
  change24h: number;
  mcap: number;
  buybackVol: number;
}

export interface Agent {
  id: string;
  name: string;
  strategy: string;
  avatar: string;
  roi: number;
  winRate: number;
  streak: number;
  totalBets: number;
  pnl: number;
  rank: number;
  status: 'active' | 'idle';
  token: AgentToken;
}

export interface Market {
  id: string;
  question: string;
  category: string;
  volume: number;
  endDate: string;
  agents: MarketAgent[];
}

export interface MarketAgent {
  agentId: string;
  position: 'YES' | 'NO';
  confidence: number;
  amount: number;
  timestamp: string;
}

export interface FeedItem {
  id: string;
  agentId: string;
  action: string;
  market: string;
  position?: 'YES' | 'NO';
  amount?: number;
  timestamp: string;
  type: 'trade' | 'win' | 'loss' | 'streak';
}

export interface BettingPool {
  marketId: string;
  agentId: string;
  yesPool: number;
  noPool: number;
  totalBettors: number;
}

export const agents: Agent[] = [
  {
    id: 'alpha',
    name: 'ALPHA-7',
    strategy: 'Contrarian momentum',
    avatar: '&#x25C8;',
    roi: 34.2,
    winRate: 72,
    streak: 5,
    totalBets: 148,
    pnl: 12840,
    rank: 1,
    status: 'active',
    token: { ticker: '$ALPHA7', price: 0.82, change24h: 12.4, mcap: 820000, buybackVol: 14200 },
  },
  {
    id: 'sigma',
    name: 'SIGMA',
    strategy: 'Sentiment analysis',
    avatar: '&#x25CE;',
    roi: 28.7,
    winRate: 68,
    streak: 3,
    totalBets: 203,
    pnl: 9420,
    rank: 2,
    status: 'active',
    token: { ticker: '$SIGMA', price: 0.54, change24h: 8.1, mcap: 540000, buybackVol: 9800 },
  },
  {
    id: 'viper',
    name: 'VIPER-X',
    strategy: 'News-reactive scalper',
    avatar: '&#x25C6;',
    roi: 21.5,
    winRate: 61,
    streak: -2,
    totalBets: 312,
    pnl: 6230,
    rank: 3,
    status: 'active',
    token: { ticker: '$VIPER', price: 0.37, change24h: -3.2, mcap: 370000, buybackVol: 6400 },
  },
  {
    id: 'oracle',
    name: 'ORACLE',
    strategy: 'Historical pattern matching',
    avatar: '&#x25C9;',
    roi: 18.3,
    winRate: 65,
    streak: 1,
    totalBets: 97,
    pnl: 4150,
    rank: 4,
    status: 'active',
    token: { ticker: '$ORACLE', price: 0.29, change24h: 4.7, mcap: 290000, buybackVol: 4300 },
  },
  {
    id: 'chaos',
    name: 'CHAOS',
    strategy: 'High-volatility hunter',
    avatar: '&#x25CA;',
    roi: -5.2,
    winRate: 44,
    streak: -4,
    totalBets: 256,
    pnl: -2100,
    rank: 5,
    status: 'active',
    token: { ticker: '$CHAOS', price: 0.08, change24h: -18.5, mcap: 80000, buybackVol: 0 },
  },
  {
    id: 'zen',
    name: 'ZEN-9',
    strategy: 'Conservative EV maximizer',
    avatar: '&#x25CB;',
    roi: 15.1,
    winRate: 71,
    streak: 2,
    totalBets: 64,
    pnl: 3080,
    rank: 6,
    status: 'idle',
    token: { ticker: '$ZEN9', price: 0.21, change24h: 2.3, mcap: 210000, buybackVol: 3100 },
  },
];

export const markets: Market[] = [
  {
    id: 'm1',
    question: 'Will Bitcoin exceed $150k by March 2026?',
    category: 'Crypto',
    volume: 2450000,
    endDate: '2026-03-31',
    agents: [
      { agentId: 'alpha', position: 'YES', confidence: 78, amount: 5000, timestamp: '2m ago' },
      { agentId: 'sigma', position: 'YES', confidence: 65, amount: 3200, timestamp: '5m ago' },
      { agentId: 'viper', position: 'NO', confidence: 82, amount: 4100, timestamp: '1m ago' },
      { agentId: 'oracle', position: 'YES', confidence: 55, amount: 2000, timestamp: '12m ago' },
      { agentId: 'chaos', position: 'NO', confidence: 91, amount: 8000, timestamp: '30s ago' },
    ],
  },
  {
    id: 'm2',
    question: 'Will the Fed cut rates in Q1 2026?',
    category: 'Economy',
    volume: 8200000,
    endDate: '2026-03-31',
    agents: [
      { agentId: 'alpha', position: 'NO', confidence: 88, amount: 7500, timestamp: '8m ago' },
      { agentId: 'sigma', position: 'NO', confidence: 72, amount: 4000, timestamp: '15m ago' },
      { agentId: 'viper', position: 'YES', confidence: 60, amount: 2800, timestamp: '3m ago' },
      { agentId: 'chaos', position: 'YES', confidence: 95, amount: 9200, timestamp: '1m ago' },
    ],
  },
  {
    id: 'm3',
    question: 'Will ETH flip SOL in daily volume this week?',
    category: 'Crypto',
    volume: 920000,
    endDate: '2026-02-23',
    agents: [
      { agentId: 'alpha', position: 'YES', confidence: 61, amount: 3000, timestamp: '20m ago' },
      { agentId: 'oracle', position: 'NO', confidence: 74, amount: 4500, timestamp: '7m ago' },
      { agentId: 'zen', position: 'YES', confidence: 58, amount: 1800, timestamp: '45m ago' },
    ],
  },
  {
    id: 'm4',
    question: 'Will a major CEX get hacked in February 2026?',
    category: 'Security',
    volume: 540000,
    endDate: '2026-02-28',
    agents: [
      { agentId: 'sigma', position: 'NO', confidence: 85, amount: 5500, timestamp: '2m ago' },
      { agentId: 'viper', position: 'YES', confidence: 42, amount: 1200, timestamp: '30m ago' },
      { agentId: 'chaos', position: 'YES', confidence: 77, amount: 6000, timestamp: '4m ago' },
    ],
  },
];

export const feedItems: FeedItem[] = [
  { id: 'f1', agentId: 'chaos', action: 'went ALL IN', market: 'BTC > $150k', position: 'NO', amount: 8000, timestamp: '30s ago', type: 'trade' },
  { id: 'f2', agentId: 'alpha', action: 'took position', market: 'Fed rate cut Q1', position: 'NO', amount: 7500, timestamp: '8m ago', type: 'trade' },
  { id: 'f3', agentId: 'alpha', action: 'hit 5-win streak', market: '', timestamp: '12m ago', type: 'streak' },
  { id: 'f4', agentId: 'viper', action: 'got WRECKED on', market: 'SOL ATH prediction', amount: 4100, timestamp: '18m ago', type: 'loss' },
  { id: 'f5', agentId: 'sigma', action: 'took position', market: 'CEX hack Feb', position: 'NO', amount: 5500, timestamp: '22m ago', type: 'trade' },
  { id: 'f6', agentId: 'oracle', action: 'won', market: 'ETH merge anniversary pump', amount: 3200, timestamp: '35m ago', type: 'win' },
  { id: 'f7', agentId: 'chaos', action: 'lost AGAIN on', market: 'DOGE to $1', amount: 6500, timestamp: '42m ago', type: 'loss' },
  { id: 'f8', agentId: 'zen', action: 'quietly took position', market: 'ETH vs SOL volume', position: 'YES', amount: 1800, timestamp: '45m ago', type: 'trade' },
  { id: 'f9', agentId: 'viper', action: 'took position', market: 'Fed rate cut Q1', position: 'YES', amount: 2800, timestamp: '50m ago', type: 'trade' },
  { id: 'f10', agentId: 'alpha', action: 'won', market: 'Trump crypto EO', amount: 5000, timestamp: '1h ago', type: 'win' },
];

export const bettingPools: BettingPool[] = [
  { marketId: 'm1', agentId: 'alpha', yesPool: 24500, noPool: 18200, totalBettors: 142 },
  { marketId: 'm1', agentId: 'viper', yesPool: 8900, noPool: 31200, totalBettors: 89 },
  { marketId: 'm2', agentId: 'chaos', yesPool: 45000, noPool: 12000, totalBettors: 231 },
  { marketId: 'm2', agentId: 'alpha', yesPool: 15000, noPool: 38000, totalBettors: 178 },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}

// Generate P&L time-series data for each agent
// Each agent starts at $1,000 and drifts based on their overall ROI tendency
function generatePnlSeries(agentId: string, finalPnl: number, winRate: number): { day: number; value: number }[] {
  const points = 30; // 30 days
  const data: { day: number; value: number }[] = [];
  const startValue = 1000;
  const endValue = startValue + finalPnl / 10; // scale down to fit $1k starting point

  // Use a seeded random based on agentId for consistency
  let seed = 0;
  for (let i = 0; i < agentId.length; i++) seed += agentId.charCodeAt(i);
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed % 1000) / 1000;
  };

  let current = startValue;
  const drift = (endValue - startValue) / points;

  for (let i = 0; i <= points; i++) {
    data.push({ day: i, value: Math.round(current) });
    const volatility = (100 - winRate) * 1.5;
    const noise = (rand() - 0.45) * volatility;
    current += drift + noise;
  }

  // Ensure last point matches intended direction
  data[points].value = Math.round(endValue);
  return data;
}

export interface PnlDataPoint {
  day: number;
  [agentId: string]: number;
}

export function getPnlChartData(): PnlDataPoint[] {
  const series: Record<string, { day: number; value: number }[]> = {};

  for (const agent of agents) {
    series[agent.id] = generatePnlSeries(agent.id, agent.pnl, agent.winRate);
  }

  const data: PnlDataPoint[] = [];
  for (let i = 0; i <= 30; i++) {
    const point: PnlDataPoint = { day: i };
    for (const agent of agents) {
      point[agent.id] = series[agent.id][i].value;
    }
    data.push(point);
  }

  return data;
}

export const AGENT_COLORS: Record<string, string> = {
  alpha: '#00ff88',
  sigma: '#4488ff',
  viper: '#ff3355',
  oracle: '#ffcc00',
  chaos: '#ff6633',
  zen: '#88ddff',
};
