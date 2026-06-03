import { Award, Flame, Star, Target } from "lucide-react";

interface AchievementsProps {
  badges: string[];
  totalStars: number;
  streakDays: number;
}

export default function Achievements({ badges, totalStars, streakDays }: AchievementsProps) {
  const visibleBadges = [...new Set([...badges, "每日陪伴者"])];

  return (
    <main className="page-shell">
      <section className="section-header">
        <p className="eyebrow">我的成就</p>
        <h1>星星和徽章</h1>
        <span>第一版先记录简单奖励。</span>
      </section>

      <section className="achievement-summary">
        <article>
          <Star size={30} />
          <strong>{totalStars}</strong>
          <span>累计星星</span>
        </article>
        <article>
          <Flame size={30} />
          <strong>{streakDays}</strong>
          <span>连续天数</span>
        </article>
        <article>
          <Target size={30} />
          <strong>22</strong>
          <span>今日目标题</span>
        </article>
      </section>

      <section className="badge-grid">
        {visibleBadges.map((badge) => (
          <article className="badge-card" key={badge}>
            <Award size={28} />
            <strong>{badge}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
