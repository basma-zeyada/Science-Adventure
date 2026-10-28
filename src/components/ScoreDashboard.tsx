import { Award, Flame, Star, Trophy } from 'lucide-react';

type ScoreDashboardProps = { totalScore: number; completedCount: number; streak: number };

export function ScoreDashboard({ totalScore, completedCount, streak }: ScoreDashboardProps) {
  return (
    <div className="dashboard-grid">
      <div className="stat-card stat-score"><div className="stat-icon"><Trophy size={18} /></div><div><span>Total stars</span><strong>{totalScore}</strong></div></div>
      <div className="stat-card stat-progress"><div className="stat-icon"><Award size={18} /></div><div><span>Levels cleared</span><strong>{completedCount}/32</strong></div></div>
      <div className="stat-card stat-streak"><div className="stat-icon"><Flame size={18} /></div><div><span>Adventure streak</span><strong>{streak} day{streak === 1 ? '' : 's'}</strong></div></div>
    </div>
  );
}

export function Stars({ count, small = false }: { count: number; small?: boolean }) {
  return <span className={`stars ${small ? 'stars-small' : ''}`} aria-label={`${count} out of 3 stars`}>{[1, 2, 3].map((star) => <Star key={star} size={small ? 12 : 16} fill={star <= count ? 'currentColor' : 'none'} strokeWidth={star <= count ? 2.6 : 1.6} />)}</span>;
}
