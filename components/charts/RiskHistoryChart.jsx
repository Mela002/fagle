'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RiskHistoryChart({ recommendations = [] }) {
  if (!recommendations.length) return null;
  const data = [...recommendations]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((r) => ({
      time: new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      score: r.risk_score,
    }));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <h3 className="mb-2 text-sm font-semibold text-emerald-950">Historique du risque (score de risque du prototype)</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E521C" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#2E521C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#05966920" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#05966980" />
            <YAxis tick={{ fontSize: 11 }} stroke="#05966980" domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="score" name="Score de risque (%)" stroke="#2E521C" fill="url(#riskFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
