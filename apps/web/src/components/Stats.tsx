'use client';

import { useEffect, useState } from 'react';

export function Stats() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Animate numbers on load
    const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        setter(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    animateValue(0, 12847, 2000, (val) => setStats(prev => ({ ...prev, totalTransactions: val })));
    animateValue(0, 2453, 2000, (val) => setStats(prev => ({ ...prev, totalVolume: val })));
    animateValue(0, 891, 2000, (val) => setStats(prev => ({ ...prev, activeUsers: val })));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
        <p className="text-4xl font-bold text-white mb-2">{stats.totalTransactions.toLocaleString()}</p>
        <p className="text-gray-400">Private Transactions</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
        <p className="text-4xl font-bold text-white mb-2">{stats.totalVolume.toLocaleString()} SOL</p>
        <p className="text-gray-400">Total Volume</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
        <p className="text-4xl font-bold text-white mb-2">{stats.activeUsers.toLocaleString()}</p>
        <p className="text-gray-400">Active Users</p>
      </div>
    </div>
  );
}

