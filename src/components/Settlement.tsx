import { BatteryCharging, CalendarDays, CheckCircle2, Gem, Sparkles } from "lucide-react";
import { getBuddy, getNextLockedBuddy } from "../data/buddies";
import type { DailyProgress, SessionStats } from "../types";
import { skillLabels, summarizeSession } from "../utils/learningProfile";
import { dateKey, getCurrentStreak } from "../utils/progressMetrics";
import FoxCoach from "./FoxCoach";

interface SettlementProps {
  stats: SessionStats;
  progress: DailyProgress;
  onDone: () => void;
}

export default function Settlement({ stats, progress, onDone }: SettlementProps) {
  const stars = Math.max(1, Math.min(3, stats.stars));
  const activeBuddy = getBuddy(progress.activeBuddyId);
  const nextBuddy = getNextLockedBuddy(progress.unlockedBuddyIds);
  const learningSummary = summarizeSession(stats.records);
  const nextRounds = progress.completedRounds + 1;
  const today = dateKey();
  const nextCompletedDates = progress.completedDates.includes(today) ? progress.completedDates : [...progress.completedDates, today];
  const nextStreakDays = getCurrentStreak(nextCompletedDates);
  const totalDurationMs = stats.records.reduce((sum, record) => sum + record.durationMs, 0);
  const achievementPassed = {
    firstPerfect: progress.completedRounds === 0 && stats.answered > 0 && stats.correct === stats.answered,
    speedUnder5: stats.answered >= 20 && totalDurationMs <= 5 * 60 * 1000,
    cleanSigns: stats.answered >= 20 && stats.signMistakes === 0
  };
  const willUnlock =
    nextBuddy &&
    ((nextBuddy.unlockKind === "rounds" && nextRounds >= nextBuddy.requirement) ||
      (nextBuddy.unlockKind === "streak" && nextStreakDays >= nextBuddy.requirement) ||
      (nextBuddy.unlockKind === "achievement" && nextBuddy.achievementKey && achievementPassed[nextBuddy.achievementKey]));
  const unlockText = nextBuddy
    ? willUnlock
      ? `${nextBuddy.name}已经在小屋门口等你啦！`
      : nextBuddy.unlockKind === "rounds"
        ? `还差 ${Math.max(nextBuddy.requirement - nextRounds, 0)} 轮，${nextBuddy.name}就会出现。`
        : nextBuddy.unlockKind === "streak"
          ? `连续答题还差 ${Math.max(nextBuddy.requirement - nextStreakDays, 0)} 天，${nextBuddy.name}就会出现。`
          : nextBuddy.unlockText
    : "图鉴里的伙伴都在小屋啦。";
  const encouragement =
    stats.signMistakes > 0
      ? `今天完成了 ${stats.answered} 题。有 ${stats.signMistakes} 题可能看错符号，明天我们先看清 + 还是 -。`
      : stats.slowCount > 0
        ? `今天完成了 ${stats.answered} 题。慢一点也没关系，答稳了就是进步。`
        : `今天完成了 ${stats.answered} 题，${activeBuddy.name}能量变满啦！`;

  return (
    <main className="page-shell settlement-shell">
      <section className="settlement-panel">
        <div className="settlement-pet">
          <div className="cat-greeting settlement-greeting">
            {encouragement}
            <br />
            {unlockText}
          </div>
          <FoxCoach size="large" buddyId={activeBuddy.id} />
        </div>
        <p className="eyebrow">今日答题完成</p>
        <h1>获得 {stars} 颗星</h1>
        <div className="earned-stars" aria-label={`获得 ${stars} 颗星`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Sparkles key={index} className={index < stars ? "is-earned" : ""} size={38} />
          ))}
        </div>

        <div className="result-grid">
          <article>
            <CheckCircle2 size={26} />
            <strong>完成 {stats.answered} 题</strong>
            <span>完成今日答题</span>
          </article>
          <article>
            <BatteryCharging size={26} />
            <strong>能量 +{stars * 10}%</strong>
            <span>{activeBuddy.name}更有精神了</span>
          </article>
          <article>
            <Gem size={26} />
            <strong>{willUnlock ? "新伙伴解锁" : "进度 +1"}</strong>
            <span>{unlockText}</span>
          </article>
          <article>
            <CalendarDays size={26} />
            <strong>明天再来</strong>
            <span>坚持答题会遇到更多伙伴</span>
          </article>
        </div>

        <div className="coach-note">
          <strong>{activeBuddy.name}的话</strong>
          <p>{encouragement}</p>
          <p>明天回来时，我会准备新的题目和伙伴进度等你。</p>
        </div>

        <div className="learning-summary">
          <div>
            <strong>今日答题总结</strong>
            <p>{learningSummary.title}</p>
            <span>{learningSummary.detail}</span>
          </div>
          <div>
            <strong>下次练习会调整</strong>
            <p>{learningSummary.nextPlan}</p>
            {learningSummary.focusSkills.length > 0 && (
              <div className="focus-tags">
                {learningSummary.focusSkills.map((skill) => (
                  <i key={skill}>{skillLabels[skill]}</i>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="primary-button" type="button" onClick={onDone}>
          完成
        </button>
      </section>
    </main>
  );
}
