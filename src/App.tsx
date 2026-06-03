import { useState } from "react";
import Achievements from "./components/Achievements";
import BottomNav from "./components/BottomNav";
import PetRoom from "./components/PetRoom";
import PracticeScreen from "./components/PracticeScreen";
import Settlement from "./components/Settlement";
import TodayHome from "./components/TodayHome";
import { dailyLesson } from "./data/dailyLesson";
import { buddies, type Buddy } from "./data/buddies";
import type { DailyProgress, LessonStep, SessionStats, StageConfig, TabKey } from "./types";
import { getFocusSkills, updateSkillProfile } from "./utils/learningProfile";
import { createStages } from "./utils/practiceEngine";
import { getCurrentStreak } from "./utils/progressMetrics";
import { loadProgress, saveProgress, todayKey } from "./utils/storage";

const stepOrder: LessonStep[] = ["warmup", "main", "challenge"];

const emptyStats: SessionStats = {
  answered: 0,
  correct: 0,
  stars: 0,
  slowCount: 0,
  signMistakes: 0,
  records: []
};

function buddyCurrentValue(buddy: Buddy, completedRounds: number, streakDays: number, unlockedIds: Set<string>) {
  if (buddy.unlockKind === "starter") return buddy.requirement;
  if (buddy.unlockKind === "rounds") return completedRounds;
  if (buddy.unlockKind === "streak") return streakDays;
  return unlockedIds.has(buddy.id) ? buddy.requirement : 0;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [lessonStep, setLessonStep] = useState<LessonStep>("today");
  const [progress, setProgress] = useState<DailyProgress>(() => loadProgress());
  const [sessionStats, setSessionStats] = useState<SessionStats>(emptyStats);
  const [stages, setStages] = useState<StageConfig[]>(() => createStages(getFocusSkills(progress.skillProfile)));

  const activeStage = stages.find((stage) => stage.id === lessonStep);
  const showBottomNav = lessonStep === "today";

  function startLesson() {
    setStages(createStages(getFocusSkills(progress.skillProfile)));
    setSessionStats(emptyStats);
    setLessonStep("warmup");
    setActiveTab("today");
  }

  function goNextStage() {
    const currentIndex = stepOrder.indexOf(lessonStep);
    const next = stepOrder[currentIndex + 1];
    if (next) {
      setLessonStep(next);
      return;
    }

    setSessionStats((current) => {
      const accuracy = current.answered === 0 ? 0 : current.correct / current.answered;
      const stars = accuracy >= 0.9 && current.signMistakes === 0 ? 3 : accuracy >= 0.75 ? 2 : 1;
      return { ...current, stars };
    });
    setLessonStep("settlement");
  }

  function returnToToday() {
    setSessionStats(emptyStats);
    setLessonStep("today");
    setActiveTab("today");
  }

  function completeDay() {
    const date = todayKey();
    setProgress((current) => {
      const hasCompleted = current.completedDates.includes(date);
      const completedRounds = current.completedRounds + 1;
      const completedDates = hasCompleted ? current.completedDates : [...current.completedDates, date];
      const streakDays = getCurrentStreak(completedDates);
      const nextUnlocked = new Set(current.unlockedBuddyIds);
      const totalDurationMs = sessionStats.records.reduce((sum, record) => sum + record.durationMs, 0);
      const isPerfect = sessionStats.answered > 0 && sessionStats.correct === sessionStats.answered;
      const achievementPassed = {
        firstPerfect: current.completedRounds === 0 && isPerfect,
        speedUnder5: sessionStats.answered >= 20 && totalDurationMs <= 5 * 60 * 1000,
        cleanSigns: sessionStats.answered >= 20 && sessionStats.signMistakes === 0
      };

      buddies.forEach((buddy) => {
        if (buddy.unlockKind === "rounds" && completedRounds >= buddy.requirement) nextUnlocked.add(buddy.id);
        if (buddy.unlockKind === "streak" && streakDays >= buddy.requirement) nextUnlocked.add(buddy.id);
        if (buddy.unlockKind === "achievement" && buddy.achievementKey && achievementPassed[buddy.achievementKey]) {
          nextUnlocked.add(buddy.id);
        }
      });

      const buddyShards = { ...current.buddyShards };
      buddies.forEach((buddy) => {
        buddyShards[buddy.id] = Math.min(buddyCurrentValue(buddy, completedRounds, streakDays, nextUnlocked), Math.max(buddy.requirement, 1));
      });
      const skillProfile = updateSkillProfile(current.skillProfile, sessionStats.records);

      const nextBadges = new Set(current.badges);
      nextBadges.add("星露喵伙伴");
      if (achievementPassed.firstPerfect) nextBadges.add("第一次全对");
      if (achievementPassed.speedUnder5) nextBadges.add("5分钟内完成");
      if (achievementPassed.cleanSigns) nextBadges.add("符号零失误");

      const next = {
        ...current,
        completedDates,
        totalStars: current.totalStars + sessionStats.stars,
        badges: [...nextBadges],
        completedRounds,
        skillProfile,
        buddyShards,
        unlockedBuddyIds: [...nextUnlocked],
        activeBuddyId: current.activeBuddyId,
        records: [...current.records, ...sessionStats.records]
      };
      saveProgress(next);
      return next;
    });
    setLessonStep("today");
  }

  function changeTab(tab: TabKey) {
    setActiveTab(tab);
    if (tab !== "today") {
      setLessonStep("today");
    }
  }

  function renderContent() {
    if (activeTab === "pet") return <PetRoom progress={progress} streakDays={getCurrentStreak(progress.completedDates)} />;
    if (activeTab === "achievements") {
      return <Achievements badges={progress.badges} totalStars={progress.totalStars} streakDays={getCurrentStreak(progress.completedDates)} />;
    }

    if (lessonStep === "settlement") return <Settlement stats={sessionStats} progress={progress} onDone={completeDay} />;
    if (activeStage) {
      return (
        <PracticeScreen
          key={activeStage.id}
          stage={activeStage}
          stats={sessionStats}
          onStatsChange={setSessionStats}
          onComplete={goNextStage}
          onBack={returnToToday}
        />
      );
    }

    return <TodayHome lesson={dailyLesson} totalStars={progress.totalStars} onStart={startLesson} />;
  }

  return (
    <div className="app-shell">
      {renderContent()}
      {showBottomNav && <BottomNav active={activeTab} onChange={changeTab} />}
    </div>
  );
}
