import type { DailyLesson } from "../types";

export const dailyLesson: DailyLesson = {
  title: "伙伴每日答题",
  theme: "星露喵醒啦 今日答题",
  practiceFocus: "加减乘除混合口算",
  duration: "约 6 分钟",
  goal: "完成 20 题，收集伙伴进度",
  streakDays: 5,
  weekCompleted: 3,
  introLines: [
    "今天会遇到加、减、乘、除四种题。",
    "先看清符号，再决定用哪种方法。",
    "遇到退位减法时，个位不够减要向十位借 1。",
    "遇到乘除题时，可以想乘法口诀。",
    "答得慢没关系，先稳住，再慢慢提速。"
  ]
};
