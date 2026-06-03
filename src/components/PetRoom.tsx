import { BatteryCharging, Heart, Lock, Sparkles } from "lucide-react";
import { buddies, getBuddy, getNextLockedBuddy } from "../data/buddies";
import type { DailyProgress } from "../types";
import { getCurrentStreak } from "../utils/progressMetrics";
import FoxCoach from "./FoxCoach";

interface PetRoomProps {
  progress: DailyProgress;
  streakDays: number;
}

function buddyProgress(progress: DailyProgress, buddyId: string) {
  const buddy = getBuddy(buddyId);
  if (buddy.unlockKind === "starter") return 1;
  if (buddy.unlockKind === "achievement") return progress.unlockedBuddyIds.includes(buddy.id) ? 1 : 0;
  const current = buddy.unlockKind === "rounds" ? progress.completedRounds : getCurrentStreak(progress.completedDates);
  return Math.min(current / buddy.requirement, 1);
}

function unlockLabel(kind: string) {
  if (kind === "rounds") return "完成轮数";
  if (kind === "streak") return "连续天数";
  if (kind === "achievement") return "成就获得";
  return "初始伙伴";
}

export default function PetRoom({ progress, streakDays }: PetRoomProps) {
  const activeBuddy = getBuddy(progress.activeBuddyId);
  const nextBuddy = getNextLockedBuddy(progress.unlockedBuddyIds);
  const nextValue = nextBuddy ? Math.round(buddyProgress(progress, nextBuddy.id) * nextBuddy.requirement) : 0;
  const currentStreak = getCurrentStreak(progress.completedDates);

  return (
    <main className="page-shell">
      <section className="pet-room">
        <div className="pet-room-copy">
          <p className="eyebrow">伙伴小屋</p>
          <h1>{activeBuddy.name} 在等你</h1>
          <p>完成每日答题可以推进伙伴解锁。大部分伙伴只要坚持答题就会获得，少数伙伴来自全对、限时完成等成就。</p>
          <div className="pet-meters">
            <span>
              <BatteryCharging size={20} />
              能量 68%
            </span>
            <span>
              <Heart size={20} />
              连续 {streakDays} 天
            </span>
            <span>
              <Sparkles size={20} />
              {progress.totalStars} 星
            </span>
          </div>
          {nextBuddy && (
            <div className="unlock-callout">
              <strong>下一个伙伴：{nextBuddy.name}</strong>
              <span>
                {unlockLabel(nextBuddy.unlockKind)} {nextBuddy.unlockKind === "achievement" ? nextBuddy.title : `${nextValue}/${nextBuddy.requirement}`}
              </span>
              <i style={{ width: `${buddyProgress(progress, nextBuddy.id) * 100}%` }} />
            </div>
          )}
        </div>
        <div className="pet-room-stage">
          <div className="cat-greeting pet-room-greeting">今天也一起挑战吧。</div>
          <FoxCoach size="large" buddyId={activeBuddy.id} />
        </div>
      </section>

      <section className="buddy-dex">
        {buddies.map((buddy) => {
          const unlocked = buddy.unlockKind === "starter" || progress.unlockedBuddyIds.includes(buddy.id);
          const percent = buddyProgress(progress, buddy.id);
          const current =
            buddy.unlockKind === "rounds"
              ? progress.completedRounds
              : buddy.unlockKind === "streak"
                ? currentStreak
                : unlocked
                  ? buddy.requirement
                  : 0;
          return (
            <article className={`buddy-card ${buddy.tone} ${unlocked ? "is-unlocked" : "is-locked"}`} key={buddy.id}>
              <div className="buddy-art">
                <img src={buddy.image} alt={buddy.name} />
                {!unlocked && <Lock size={30} />}
              </div>
              <div className="buddy-info">
                <span>{buddy.title}</span>
                <h2>{buddy.name}</h2>
                <p>{buddy.intro}</p>
                <em>{buddy.unlockText}</em>
                {unlocked ? (
                  <strong>已入住</strong>
                ) : (
                  <div className="buddy-progress">
                    <span>
                      {Math.min(current, buddy.requirement)}/{buddy.requirement}
                    </span>
                    <i style={{ width: `${percent * 100}%` }} />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
