export default function getColorFromString(str) {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#6366f1', // indigo
    '#ec4899', // pink
    '#14b8a6', // teal
    '#8b5cf6', // violet
    '#eab308', // yellow
    '#06b6d4', // cyan
  ];

  // const colors = [
  //   '#94a3b8', // slate-400
  //   '#64748b', // slate-500
  //   '#475569', // slate-600
  //   '#334155', // slate-700
  //   '#1e293b', // slate-800
  // ]

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
