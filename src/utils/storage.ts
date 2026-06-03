import type { DailyProgress } from "../types";
import { dateKey } from "./progressMetrics";

const STORAGE_KEY = "mental-math-planet-progress";

const defaultProgress: DailyProgress = {
  completedDates: [],
  totalStars: 12,
  badges: ["稳稳起步", "星露喵伙伴"],
  activeBuddyId: "xinglumiao",
  unlockedBuddyIds: ["xinglumiao"],
  buddyShards: {
    "xuetuan-tu": 0,
    "yunpao-jing": 0,
    "huomiao-xi": 0,
    "shigu-gui": 0,
    "modian-zhang": 0,
    "yuanli-xiong": 0,
    "shanhu-wa": 0,
    "xingke-luo": 0,
    "yingye-long": 0,
    "wujiao-yang": 0,
    "shazhong-xie": 0,
    "lingguang-yao": 0,
    "yueya-lu": 0,
    "dianguang-hu": 0,
    "fengling-niao": 0
  },
  completedRounds: 0,
  skillProfile: {},
  records: []
};

export function loadProgress(): DailyProgress {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultProgress;
    const parsed = JSON.parse(saved);
    return {
      ...defaultProgress,
      ...parsed,
      unlockedBuddyIds: [...new Set(["xinglumiao", ...(parsed.unlockedBuddyIds ?? defaultProgress.unlockedBuddyIds)])],
      buddyShards: { ...defaultProgress.buddyShards, ...(parsed.buddyShards ?? {}) },
      completedRounds: parsed.completedRounds ?? defaultProgress.completedRounds,
      skillProfile: parsed.skillProfile ?? defaultProgress.skillProfile
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: DailyProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function todayKey() {
  return dateKey();
}
