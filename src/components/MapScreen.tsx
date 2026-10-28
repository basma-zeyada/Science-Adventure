import { Check, ChevronRight, LockKeyhole, Sparkles, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Chapter, LevelKind, ScienceLevel } from '@/ChapterData';
import { Stars } from '@/components/ScoreDashboard';

type MapScreenProps = { chapters: Chapter[]; completed: Record<string, number>; onStart: (level: ScienceLevel) => void };

const kindLabel: Record<LevelKind, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard', boss: 'Boss challenge' };
const kindClass: Record<LevelKind, string> = { easy: 'node-easy', medium: 'node-medium', hard: 'node-hard', boss: 'node-boss' };

export function MapScreen({ chapters, completed, onStart }: MapScreenProps) {
  return <main className="map-wrap">
    <div className="map-intro"><div><p className="eyebrow">Your science trail</p><h2>Choose your next discovery</h2><p className="muted-copy">Clear each glowing stop to unlock the next one. Every chapter ends with a boss challenge.</p></div><div className="map-badge"><Sparkles size={17} /><span>8 worlds<br /><b>32 missions</b></span></div></div>
    <div className="chapter-list">
      {chapters.map((chapter) => <section className="chapter-card" key={chapter.id} style={{ '--chapter-color': chapter.color, '--chapter-accent': chapter.accent } as CSSProperties}>
        <div className="chapter-heading"><div className="chapter-icon">{chapter.icon}</div><div><p className="chapter-kicker">Chapter {chapter.id}</p><h3>{chapter.title}</h3><p>{chapter.discovery}</p></div><span className="chapter-chip">{chapter.shortTitle}</span></div>
        <div className="level-track">
          {chapter.levels.map((level, index) => { const previous = index === 0 ? chapter.id === 1 ? undefined : chapters[chapter.id - 2].levels[3].id : chapter.levels[index - 1].id; const unlocked = !previous || Boolean(completed[previous]); const stars = completed[level.id] ?? 0; return <div className="level-stop" key={level.id}>
            {index > 0 && <div className={`track-line ${unlocked ? 'track-live' : ''}`} />}
            <button className={`level-node ${kindClass[level.kind]} ${unlocked ? 'is-open' : 'is-locked'} ${stars ? 'is-complete' : ''}`} onClick={() => unlocked && onStart(level)} disabled={!unlocked} aria-label={`${level.title}, ${unlocked ? 'open' : 'locked'}`}>
              <span className="node-symbol">{stars ? <Check size={21} strokeWidth={3} /> : unlocked ? <Star size={21} fill="currentColor" /> : <LockKeyhole size={19} />}</span><span className="node-number">{index + 1}</span>
            </button><div className="level-meta"><strong>{level.title}</strong><span>{kindLabel[level.kind]} {stars > 0 && <Stars count={stars} small />}</span></div>
            {stars > 0 && <div className="floating-star"><Star size={13} fill="currentColor" /></div>}
          </div> })}
        </div>
        <div className="chapter-footer"><span>{chapter.levels.filter((level) => completed[level.id]).length}/4 missions complete</span><div className="mini-progress"><i style={{ width: `${chapter.levels.filter((level) => completed[level.id]).length * 25}%` }} /></div><ChevronRight size={17} /></div>
      </section>)}
    </div>
  </main>;
}
