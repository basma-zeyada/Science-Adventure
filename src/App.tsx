import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, ChevronDown, Compass, Gift, Music2, VolumeX } from 'lucide-react';
import { chapters, levelOrder, type ScienceLevel } from '@/ChapterData';
import { GameQuizModal } from '@/components/GameQuizModal';
import { MapScreen } from '@/components/MapScreen';
import { ScoreDashboard } from '@/components/ScoreDashboard';

type SavedProgress = { completed: Record<string, number>; totalScore: number; lastPlayed: string; soundOn: boolean };
const storageKey = 'primary-4-science-adventure';
const defaultProgress: SavedProgress = { completed: {}, totalScore: 0, lastPlayed: '', soundOn: true };

function getProgress(): SavedProgress { try { const saved = localStorage.getItem(storageKey); return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress; } catch { return defaultProgress; } }
function playChime(enabled: boolean, win = false) { if (!enabled) return; const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (!AudioContextClass) return; const context = new AudioContextClass(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = win ? 720 : 420; gain.gain.setValueAtTime(0.05, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.35); }

function App() {
  const [progress, setProgress] = useState<SavedProgress>(getProgress);
  const [activeLevel, setActiveLevel] = useState<ScienceLevel | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const completedCount = Object.keys(progress.completed).length;
  const streak = progress.lastPlayed ? 1 : 0;
  const nextLevel = useMemo(() => levelOrder.find((id) => !progress.completed[id]), [progress.completed]);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(progress)); }, [progress]);
  const updatePlayed = () => setProgress((current) => ({ ...current, lastPlayed: new Date().toISOString().slice(0, 10) }));
  const startLevel = (level: ScienceLevel) => { updatePlayed(); setActiveLevel(level); setShowWelcome(false); playChime(progress.soundOn); };
  const completeLevel = (score: number) => { if (!activeLevel) return; setProgress((current) => ({ ...current, completed: { ...current.completed, [activeLevel.id]: Math.max(current.completed[activeLevel.id] ?? 0, score) }, totalScore: current.totalScore + score })); setActiveLevel(null); playChime(progress.soundOn, true); confetti({ particleCount: 120, spread: 75, origin: { y: 0.62 }, colors: ['#2563eb', '#facc15', '#16a34a', '#ec4899', '#7c3aed'] }); };
  const toggleSound = () => setProgress((current) => ({ ...current, soundOn: !current.soundOn }));

  return <div className="app-shell"><header className="topbar"><div className="brand"><div className="brand-mark"><Compass size={24} /></div><div><p>PRIMARY 4</p><h1>Science Adventure</h1></div></div><div className="top-actions"><button className="sound-toggle" onClick={toggleSound} aria-label={progress.soundOn ? 'Mute sounds' : 'Turn sounds on'}>{progress.soundOn ? <Music2 size={18} /> : <VolumeX size={18} />}</button><div className="profile-pill"><span className="avatar">A</span><span>Explorer</span><ChevronDown size={15} /></div></div></header>
    <section className="hero-banner"><div className="hero-copy"><span className="hero-label"><SparkIcon /> Science mission control</span><h2>Ready for your next <span>discovery?</span></h2><p>Explore, solve, and collect stars across Egypt’s most exciting science worlds.</p><button className="hero-button" onClick={() => { const level = nextLevel ? levelOrder.includes(nextLevel) ? chapters.flatMap((chapter) => chapter.levels).find((item) => item.id === nextLevel) : undefined : chapters[0].levels[0]; if (level) startLevel(level); }}><Compass size={18} /> Continue adventure</button></div><div className="mascot-scene"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="mascot"><span className="mascot-eye left" /><span className="mascot-eye right" /><span className="mascot-smile" /><span className="mascot-hand">✦</span></div><div className="hero-star star-a">★</div><div className="hero-star star-b">✦</div></div></section>
    <ScoreDashboard totalScore={progress.totalScore} completedCount={completedCount} streak={streak} />
    <div className="section-heading"><div><p className="eyebrow">Adventure map</p><h2>Egyptian Science Worlds</h2></div><div className="map-legend"><span><i className="legend-dot open" /> Open</span><span><i className="legend-dot done" /> Complete</span><span><i className="legend-dot locked" /> Locked</span></div></div>
    <MapScreen chapters={chapters} completed={progress.completed} onStart={startLevel} />
    <footer className="app-footer"><BookOpen size={18} /><span>Keep exploring: every question is a new clue.</span><Gift size={18} /></footer>
    {showWelcome && completedCount === 0 && <div className="welcome-toast"><button onClick={() => setShowWelcome(false)} aria-label="Dismiss"><span>×</span></button><strong>Welcome, young scientist!</strong><p>Start with Nature Detectives and unlock the whole trail.</p></div>}
    {activeLevel && <GameQuizModal level={activeLevel} onClose={() => setActiveLevel(null)} onComplete={completeLevel} />}
  </div>;
}

function SparkIcon() { return <span className="spark-icon">✦</span>; }
export default App;
