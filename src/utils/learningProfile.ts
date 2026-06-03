import type { AnswerRecord, SkillProfile, SkillProfileItem, SkillTag } from "../types";
import { dateKey } from "./progressMetrics";

export const skillLabels: Record<SkillTag, string> = {
  numberSense: "数感与凑整",
  carry: "进位加法",
  borrow: "退位减法",
  multiplyDivide: "乘除口诀",
  speed: "反应速度",
  attention: "专注审题"
};

const targetDurationMs: Record<SkillTag, number> = {
  numberSense: 6500,
  carry: 7500,
  borrow: 9000,
  multiplyDivide: 7000,
  speed: 5500,
  attention: 7000
};

const emptyItem: SkillProfileItem = {
  attempts: 0,
  correct: 0,
  totalDurationMs: 0,
  slowCount: 0,
  mistakeCount: 0
};

function getItem(profile: SkillProfile, skill: SkillTag): SkillProfileItem {
  return { ...emptyItem, ...(profile[skill] ?? {}) };
}

export function isSlowForSkill(skill: SkillTag, durationMs: number) {
  return durationMs > targetDurationMs[skill];
}

export function updateSkillProfile(profile: SkillProfile, records: AnswerRecord[]) {
  const next: SkillProfile = { ...profile };
  const today = dateKey();

  records.forEach((record) => {
    const skill = record.note?.includes("符号") ? "attention" : record.skill;
    const item = getItem(next, skill);
    item.attempts += 1;
    item.correct += record.isCorrect ? 1 : 0;
    item.totalDurationMs += record.durationMs;
    item.slowCount += isSlowForSkill(skill, record.durationMs) ? 1 : 0;
    item.mistakeCount += record.isCorrect && record.attempts === 1 ? 0 : 1;
    item.lastPracticedAt = today;
    next[skill] = item;
  });

  return next;
}

export function getSkillScore(item: SkillProfileItem | undefined, skill: SkillTag) {
  if (!item || item.attempts === 0) return 0;
  const accuracyGap = 1 - item.correct / item.attempts;
  const avgDuration = item.totalDurationMs / item.attempts;
  const speedGap = Math.max(0, avgDuration / targetDurationMs[skill] - 1);
  const slowRate = item.slowCount / item.attempts;
  const retryRate = item.mistakeCount / item.attempts;
  return accuracyGap * 1.2 + retryRate * 0.85 + speedGap * 0.75 + slowRate * 0.55;
}

export function getFocusSkills(profile: SkillProfile, limit = 2): SkillTag[] {
  return (Object.keys(skillLabels) as SkillTag[])
    .map((skill) => ({ skill, score: getSkillScore(profile[skill], skill), attempts: profile[skill]?.attempts ?? 0 }))
    .filter((item) => item.attempts > 0 && item.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.skill);
}

export function summarizeSession(records: AnswerRecord[]) {
  const grouped = new Map<SkillTag, SkillProfileItem>();

  records.forEach((record) => {
    const skill = record.note?.includes("符号") ? "attention" : record.skill;
    const item = grouped.get(skill) ?? { ...emptyItem };
    item.attempts += 1;
    item.correct += record.isCorrect ? 1 : 0;
    item.totalDurationMs += record.durationMs;
    item.slowCount += isSlowForSkill(skill, record.durationMs) ? 1 : 0;
    item.mistakeCount += record.isCorrect && record.attempts === 1 ? 0 : 1;
    grouped.set(skill, item);
  });

  const ranked = [...grouped.entries()]
    .map(([skill, item]) => ({ skill, item, score: getSkillScore(item, skill) }))
    .sort((a, b) => b.score - a.score);

  const weakest = ranked[0];
  const focusSkills = ranked.filter((entry) => entry.score >= 0.25).slice(0, 2).map((entry) => entry.skill);
  const averageMs = records.length === 0 ? 0 : records.reduce((sum, record) => sum + record.durationMs, 0) / records.length;

  if (!weakest || weakest.score < 0.25) {
    return {
      focusSkills,
      title: "今天整体很稳",
      detail: averageMs > 0 ? `平均每题约 ${Math.round(averageMs / 1000)} 秒，继续保持清楚审题。` : "完成后会在这里看到答题总结。",
      nextPlan: "下次会保持混合练习，继续观察反应速度和稳定性。"
    };
  }

  const item = weakest.item;
  const avg = item.totalDurationMs / item.attempts;
  const reason = item.mistakeCount > 0 ? `${item.mistakeCount} 题需要二次修正或讲解` : `平均用时约 ${Math.round(avg / 1000)} 秒`;

  return {
    focusSkills,
    title: `${skillLabels[weakest.skill]}需要多练一点`,
    detail: `今天这部分做了 ${item.attempts} 题，${reason}。`,
    nextPlan: `下次会多安排${focusSkills.map((skill) => skillLabels[skill]).join("、")}练习。`
  };
}
