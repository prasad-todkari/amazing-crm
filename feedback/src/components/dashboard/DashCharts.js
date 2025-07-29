import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { useEffect, useState } from 'react';
import { getDayWiseData, getSiteWiseData } from '../../services/FeedbackServices';

const DashCharts = () => {
  const [dayTrend, setDayTrend] = useState([]);
  const [siteTrend, setSiteTrend] = useState([]); // Max 10 sites data

  const SLATE_COLORS = [
    '#94a3b8', // slate-400
    '#64748b', // slate-500
    '#475569', // slate-600
    '#334155', // slate-700
    '#1e293b', // slate-800
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const dayWise = await getDayWiseData();
        const siteWise = await getSiteWiseData();
        setDayTrend(dayWise.data || []);
        setSiteTrend(siteWise.data || []);
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    }
    fetchData();
  }, []);

  function getSlateColor(label) {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    return SLATE_COLORS[Math.abs(hash) % SLATE_COLORS.length];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Line Chart */}
      <div className="bg-slate-100 p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfied vs Not Satisfied (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dayTrend}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`${value}`, name === 'NotSatisfied' ? 'Not Satisfied' : name]}
            />
            <Line type="monotone" dataKey="Satisfied" stroke="#696a6cff" strokeWidth={2} />
            <Line type="monotone" dataKey="NotSatisfied" stroke="#272223ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-100 p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sites Wise - Top 10</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siteTrend} >
            <XAxis 
              dataKey="name" 
              // angle={-40} 
              // textAnchor="end" 
              // interval={0} 
              // height={60} 
              className="text-xs"
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {siteTrend.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSlateColor(entry.name || '')} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashCharts;
