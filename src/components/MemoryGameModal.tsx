import { useEffect, useState } from 'react';
import { ArrowRight, Check, HelpCircle, RotateCcw, X } from 'lucide-react';
import type { MiniGame } from '@/ChapterData';
import { Stars } from '@/components/ScoreDashboard';

type MemoryGameModalProps = { title: string; pairs: MiniGame['pairs']; onClose: () => void; onComplete: (score: number) => void };
type MemoryCard = { pair: number; text: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function buildDeck(pairs: MiniGame['pairs']): MemoryCard[] {
  return shuffle(pairs.flatMap(([first, second], pair) => [{ pair, text: first }, { pair, text: second }]));
}

export function MemoryGameModal({ title, pairs, onClose, onComplete }: MemoryGameModalProps) {
  const [deck, setDeck] = useState(() => buildDeck(pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const finished = matched.length === pairs.length;
  const stars = moves <= pairs.length * 2 ? 3 : moves <= pairs.length * 3 ? 2 : 1;

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    if (deck[first].pair === deck[second].pair) {
      setMatched((current) => [...current, deck[first].pair]);
      setFlipped([]);
      return;
    }
    const timer = window.setTimeout(() => setFlipped([]), 900);
    return () => window.clearTimeout(timer);
  }, [deck, flipped]);

  const flipCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(deck[index].pair)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) setMoves((value) => value + 1);
  };

  const restart = () => {
    setDeck(buildDeck(pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
    <div className="quiz-modal">
      <div className="quiz-topline"><div><span className="quiz-chapter">MINI GAME</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <div className="quiz-progress"><div><span>Pairs found {matched.length} of {pairs.length}</span><b>{moves} moves</b></div><div className="progress-rail"><i style={{ width: `${(matched.length / pairs.length) * 100}%` }} /></div></div>
      <p className="instruction">Flip two cards at a time and match each clue to its partner.</p>
      <div className="memory-grid">{deck.map((card, index) => {
        const faceUp = flipped.includes(index) || matched.includes(card.pair);
        const isMatched = matched.includes(card.pair);
        return <button key={index} className={`memory-card ${faceUp ? 'is-face-up' : ''} ${isMatched ? 'is-matched' : ''}`} onClick={() => flipCard(index)} disabled={isMatched} aria-label={faceUp ? card.text : 'Hidden card'}>
          <span className="memory-card-inner"><span className="memory-face memory-back"><HelpCircle size={22} /></span><span className="memory-face memory-front">{card.text}</span></span>
        </button>;
      })}</div>
      {finished && <div className="feedback feedback-good"><div className="feedback-icon"><Check size={20} /></div><div><strong>Mini game complete!</strong><p>You matched every pair in {moves} moves.</p></div></div>}
      <div className="quiz-actions">{finished ? <button className="primary-button" onClick={() => onComplete(stars)}>Collect my stars <ArrowRight size={18} /></button> : <button className="secondary-button" onClick={restart}><RotateCcw size={16} /> Shuffle again</button>}</div>
      <div className="quiz-footer"><Stars count={finished ? stars : 0} small /><span>{pairs.length} matching pairs</span></div>
    </div>
  </div>;
}
