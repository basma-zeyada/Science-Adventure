import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Lightbulb, RotateCcw, X, Zap } from 'lucide-react';
import type { ScienceLevel } from '@/ChapterData';
import { Stars } from '@/components/ScoreDashboard';

type GameQuizModalProps = { level: ScienceLevel; onClose: () => void; onComplete: (score: number) => void };

export function GameQuizModal({ level, onClose, onComplete }: GameQuizModalProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const question = level.questions[questionIndex];
  const isLast = questionIndex === level.questions.length - 1;
  const correct = useMemo(() => question.type === 'sort' ? Object.keys(question.sortingAnswers ?? {}).every((item) => placements[item] === question.sortingAnswers?.[item]) : selected?.toLowerCase() === question.answer?.toLowerCase(), [placements, question, selected]);
  const canCheck = question.type === 'sort' ? Object.keys(placements).length === question.items?.length : selected !== null;

  useEffect(() => { setSelected(null); setPlacements({}); setChecked(false); setShowHint(false); }, [questionIndex]);

  const checkAnswer = () => { if (!canCheck) return; setChecked(true); if (correct) setScore((value) => value + 1); };
  const nextQuestion = () => { if (isLast) { onComplete(Math.max(1, Math.round(((score + (correct ? 1 : 0)) / level.questions.length) * 3))); } else setQuestionIndex((value) => value + 1); };
  const placeItem = (item: string, category: string) => { if (!checked) setPlacements((current) => ({ ...current, [item]: category })); };

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={level.title}>
    <div className="quiz-modal"><div className="quiz-topline"><div><span className="quiz-chapter">{level.kind === 'boss' ? 'BOSS CHALLENGE' : `${level.kind.toUpperCase()} MISSION`}</span><h2>{level.title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <div className="quiz-progress"><div><span>Question {questionIndex + 1} of {level.questions.length}</span><b>{Math.round((questionIndex / level.questions.length) * 100)}%</b></div><div className="progress-rail"><i style={{ width: `${((questionIndex + 1) / level.questions.length) * 100}%` }} /></div></div>
      <div className="question-card"><div className="question-number">{questionIndex + 1}</div><div><h3>{question.prompt}</h3><button className="hint-button" onClick={() => setShowHint((value) => !value)}><Lightbulb size={15} /> {showHint ? question.hint : 'Need a clue?'}</button></div></div>
      {question.type === 'sort' ? <div className="sort-area"><p className="instruction">Drag each clue into a category, or tap a category after selecting a clue.</p><div className="sort-items">{question.items?.map((item) => <button key={item} draggable={!checked} className={`sort-item ${placements[item] ? 'placed' : ''}`} onDragStart={(event) => event.dataTransfer.setData('text/plain', item)} onClick={() => setSelected(item)}>{item}{placements[item] && <Check size={15} />}</button>)}</div><div className="category-grid">{question.categories?.map((category) => <div className="category-drop" key={category} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeItem(event.dataTransfer.getData('text/plain'), category); }} onClick={() => selected && placeItem(selected, category)}><span>{category}</span><div>{Object.entries(placements).filter(([, value]) => value === category).map(([item]) => <em key={item}>{item}</em>)}</div></div>)}</div></div> : <div className="answer-grid">{question.options?.map((option) => <button key={option} className={`answer-option ${selected === option ? 'selected' : ''} ${checked && option.toLowerCase() === question.answer?.toLowerCase() ? 'right' : ''} ${checked && selected === option && !correct ? 'wrong' : ''}`} onClick={() => !checked && setSelected(option)}><span className="answer-letter">{String.fromCharCode(65 + (question.options?.indexOf(option) ?? 0))}</span><span>{option}</span>{checked && option.toLowerCase() === question.answer?.toLowerCase() && <Check size={18} />}</button>)}</div>}
      {checked && <div className={`feedback ${correct ? 'feedback-good' : 'feedback-bad'}`}><div className="feedback-icon">{correct ? <Check size={20} /> : <RotateCcw size={20} />}</div><div><strong>{correct ? 'Brilliant answer!' : 'Good try, explorer!'}</strong><p>{question.explanation}</p></div></div>}
      <div className="quiz-actions">{checked ? <button className="primary-button" onClick={nextQuestion}>{isLast ? 'Collect my stars' : 'Next question'} <ArrowRight size={18} /></button> : <button className="primary-button" disabled={!canCheck} onClick={checkAnswer}>Check answer <Zap size={17} fill="currentColor" /></button>}</div>
      <div className="quiz-footer"><Stars count={Math.min(3, Math.max(0, score))} small /><span>{level.questions.length} curious questions</span></div>
    </div>
  </div>;
}
