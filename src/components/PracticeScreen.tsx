import { ArrowLeft, Check, ShieldCheck, Star } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import type { AnswerRecord, Problem, SessionStats, StageConfig } from "../types";
import { classifyMistake, isCorrectAnswer } from "../utils/practiceEngine";
import FoxCoach from "./FoxCoach";
import NumberPad from "./NumberPad";

interface PracticeScreenProps {
  stage: StageConfig;
  stats: SessionStats;
  onStatsChange: Dispatch<SetStateAction<SessionStats>>;
  onComplete: () => void;
  onBack: () => void;
}

const slowThresholdMs = 9000;

export default function PracticeScreen({
  stage,
  stats,
  onStatsChange,
  onComplete,
  onBack
}: PracticeScreenProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("先看清符号，再开始计算。");
  const [feedbackKind, setFeedbackKind] = useState<"neutral" | "good" | "warn" | "explain">("neutral");
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [locked, setLocked] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  const problem = stage.problems[index] ?? stage.problems[0];
  const displayIndex = Math.min(index, Math.max(stage.problems.length - 1, 0));
  const progress = (displayIndex / stage.problems.length) * 100;

  useEffect(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setIndex(0);
    setInput("");
    setAttempts(0);
    setFeedback("先看清符号，再开始计算。");
    setFeedbackKind("neutral");
    setQuestionStartedAt(Date.now());
    setLocked(false);
  }, [stage.id]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const stageBadge = useMemo(() => {
    if (stage.id === "challenge") return "稳稳模式";
    return stage.modeLabel;
  }, [stage.id, stage.modeLabel]);

  function addDigit(digit: string) {
    setInput((current) => {
      if (current.length >= 3) return current;
      return current === "0" ? digit : current + digit;
    });
  }

  function deleteDigit() {
    setInput((current) => current.slice(0, -1));
  }

  function scheduleNextProblem(delayMs: number) {
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      nextProblem();
    }, delayMs);
  }

  function handleBack() {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    onBack();
  }

  function nextProblem() {
    if (index + 1 >= stage.problems.length) {
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
    setInput("");
    setAttempts(0);
    setFeedback("先看清符号，再开始计算。");
    setFeedbackKind("neutral");
    setQuestionStartedAt(Date.now());
    setLocked(false);
  }

  function recordAnswer(currentProblem: Problem, correct: boolean, attemptCount: number, note?: string) {
    const durationMs = Date.now() - questionStartedAt;
    const isSlow = correct && durationMs > slowThresholdMs;
    const record: AnswerRecord = {
      problemId: currentProblem.id,
      prompt: currentProblem.prompt,
      skill: currentProblem.skill,
      userAnswer: input,
      correctAnswer: String(currentProblem.answer),
      isCorrect: correct,
      attempts: attemptCount,
      durationMs,
      stage: stage.title,
      note: note ?? (isSlow ? "反应偏慢" : undefined)
    };

    onStatsChange((current) => ({
      ...current,
      answered: current.answered + 1,
      correct: current.correct + (correct ? 1 : 0),
      slowCount: current.slowCount + (isSlow ? 1 : 0),
      signMistakes: current.signMistakes + (note?.includes("符号") ? 1 : 0),
      records: [...current.records, record]
    }));
  }

  function confirm() {
    if (!input || locked) return;
    const nextAttempt = attempts + 1;
    const correct = isCorrectAnswer(problem, input);

    if (correct) {
      setLocked(true);
      setFeedback(input.length > 0 && Date.now() - questionStartedAt > slowThresholdMs ? "答对了，慢一点也没关系，稳住更重要。" : "很稳，继续。");
      setFeedbackKind("good");
      recordAnswer(problem, true, nextAttempt);
      scheduleNextProblem(700);
      return;
    }

    const mistakeNote = classifyMistake(problem, input);
    if (nextAttempt === 1) {
      setAttempts(nextAttempt);
      setFeedback(mistakeNote ?? problem.hint);
      setFeedbackKind("warn");
      return;
    }

    setLocked(true);
    recordAnswer(problem, false, nextAttempt, mistakeNote);
    setFeedback(`${problem.explanation} 正确答案是 ${problem.answer}。`);
    setFeedbackKind("explain");
    scheduleNextProblem(1900);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (locked) return;
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        addDigit(event.key);
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        deleteDigit();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        confirm();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <main className="practice-layout">
      <div className="practice-topbar">
        <button className="back-button" type="button" onClick={handleBack}>
          <ArrowLeft size={22} />
          返回今日
        </button>
      </div>
      <section className="stage-side">
        <div className="stage-topline">
          <span>{stage.subtitle}</span>
          <strong>{stageBadge}</strong>
        </div>
        <h1>{stage.title}</h1>
        <p>{stage.scene}</p>

        <div className="coach-stage">
          <FoxCoach size="small" />
          <div className={`feedback-bubble ${feedbackKind}`}>
            {feedbackKind === "good" ? <Check size={22} /> : feedbackKind === "warn" ? <ShieldCheck size={22} /> : <Star size={22} />}
            <span>{feedback}</span>
          </div>
        </div>

        <div className="stage-progress desktop-progress">
          <span>进度</span>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
          <strong>剩余 {Math.max(stage.problems.length - displayIndex, 0)} 题</strong>
        </div>
      </section>

      <section className="question-side">
        <div className="mobile-stage-header">
          <div>
            <span>{stage.title}</span>
            <strong>{displayIndex + 1}/{stage.problems.length}</strong>
          </div>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="problem-card">
          <p>第 {displayIndex + 1} 题</p>
          <h2>{problem.prompt} = ?</h2>
          <div className={`answer-box ${input ? "has-value" : ""}`}>{input || "输入答案"}</div>
        </div>

        <div className={`feedback-bubble mobile-feedback ${feedbackKind}`}>
          {feedbackKind === "good" ? <Check size={22} /> : feedbackKind === "warn" ? <ShieldCheck size={22} /> : <Star size={22} />}
          <span>{feedback}</span>
        </div>

        <NumberPad onDigit={addDigit} onBackspace={deleteDigit} onConfirm={confirm} disabled={locked} canDelete={input.length > 0} />
      </section>
    </main>
  );
}
