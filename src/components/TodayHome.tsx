import { BatteryCharging, CalendarCheck, Flame, Play, Sparkles } from "lucide-react";
import { useMemo } from "react";
import type { DailyLesson } from "../types";
import FoxCoach from "./FoxCoach";

interface TodayHomeProps {
  lesson: DailyLesson;
  totalStars: number;
  onStart: () => void;
}

const greetings = [
  "我醒啦，今天也一起挑战吧！",
  "先看符号，再算数字。",
  "完成 3 轮，会有新伙伴来。",
  "慢一点没关系，算稳最厉害。",
  "准备好了吗？我陪你答题！"
];

export default function TodayHome({ lesson, totalStars, onStart }: TodayHomeProps) {
  const greeting = useMemo(() => greetings[Math.floor(Math.random() * greetings.length)], []);

  return (
    <main className="page-shell today-shell">
      <section className="today-hero">
        <div className="hero-copy">
          <p className="eyebrow">{lesson.title}</p>
          <h1 className="today-title">
            <span>星露喵醒啦</span>
            <span>今日答题</span>
          </h1>
          <div className="lesson-facts">
            <span>今天练：{lesson.practiceFocus}</span>
            <span>预计用时：{lesson.duration}</span>
            <span>目标：完成 20 题，收集伙伴进度</span>
          </div>
          <button className="primary-button" type="button" onClick={onStart}>
            <Play size={22} fill="currentColor" />
            开始答题
          </button>
        </div>
        <div className="planet-scene lesson-cover pet-cover" aria-label="伙伴小屋">
          <div className="cover-badge">
            <span>初始伙伴</span>
            <strong>星露喵</strong>
          </div>
          <div className="cover-goal">
            <strong>3 轮</strong>
            <span>解锁雪团兔</span>
          </div>
          <div className="cat-greeting">{greeting}</div>
          <div className="home-pet-anchor">
            <FoxCoach size="medium" />
          </div>
        </div>
      </section>

      <section className="status-grid">
        <article className="stat-card">
          <Flame size={24} />
          <div>
            <strong>{lesson.streakDays} 天</strong>
            <span>连续挑战</span>
          </div>
        </article>
        <article className="stat-card">
          <CalendarCheck size={24} />
          <div>
            <strong>{lesson.weekCompleted} 次</strong>
            <span>本周完成</span>
          </div>
        </article>
        <article className="stat-card">
          <BatteryCharging size={24} />
          <div>
            <strong>68%</strong>
            <span>伙伴能量</span>
          </div>
        </article>
        <article className="stat-card">
          <Sparkles size={24} />
          <div>
            <strong>{totalStars} 星</strong>
            <span>累计奖励</span>
          </div>
        </article>
      </section>
    </main>
  );
}
