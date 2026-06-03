import lightningFoxImage from "../assets/buddies-v2/dianguang-hu.png";
import windBirdImage from "../assets/buddies-v2/fengling-niao.png";
import fireLizardImage from "../assets/buddies-v2/huomiao-xi.png";
import prismRayImage from "../assets/buddies-v2/lingguang-yao.png";
import inkOctoImage from "../assets/buddies-v2/modian-zhang.png";
import coralFrogImage from "../assets/buddies-v2/shanhu-wa.png";
import hourglassCrabImage from "../assets/buddies-v2/shazhong-xie.png";
import stoneTurtleImage from "../assets/buddies-v2/shigu-gui.png";
import mistLambImage from "../assets/buddies-v2/wujiao-yang.png";
import starCatImage from "../assets/buddies-v2/xinglumiao.png";
import starSnailImage from "../assets/buddies-v2/xingke-luo.png";
import snowRabbitImage from "../assets/buddies-v2/xuetuan-tu.png";
import leafDrakeImage from "../assets/buddies-v2/yingye-long.png";
import chestnutBearImage from "../assets/buddies-v2/yuanli-xiong.png";
import moonDeerImage from "../assets/buddies-v2/yueya-lu.png";
import cloudWhaleImage from "../assets/buddies-v2/yunpao-jing.png";

export type UnlockKind = "starter" | "rounds" | "streak" | "achievement";

export interface Buddy {
  id: string;
  name: string;
  title: string;
  intro: string;
  unlockText: string;
  unlockKind: UnlockKind;
  requirement: number;
  achievementKey?: "firstPerfect" | "speedUnder5" | "cleanSigns";
  image: string;
  tone:
    | "star"
    | "snow"
    | "bolt"
    | "sprout"
    | "cloud"
    | "flame"
    | "stone"
    | "moon"
    | "wind"
    | "ink"
    | "coral"
    | "shell"
    | "leaf"
    | "mist"
    | "sand"
    | "prism";
}

export const buddies: Buddy[] = [
  {
    id: "xinglumiao",
    name: "星露喵",
    title: "初始伙伴",
    intro: "尾巴像星星的小生物，喜欢在孩子开始答题前绕一圈。",
    unlockText: "开局入住伙伴小屋",
    unlockKind: "starter",
    requirement: 0,
    image: starCatImage,
    tone: "star"
  },
  {
    id: "xuetuan-tu",
    name: "雪团兔",
    title: "完成 3 轮",
    intro: "耳朵像雪坡，遇到难题时会安静地蹲在旁边。",
    unlockText: "完成 3 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 3,
    image: snowRabbitImage,
    tone: "snow"
  },
  {
    id: "yunpao-jing",
    name: "云泡鲸",
    title: "完成 6 轮",
    intro: "漂在空中的小鲸，喜欢把算式吹成泡泡。",
    unlockText: "完成 6 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 6,
    image: cloudWhaleImage,
    tone: "cloud"
  },
  {
    id: "huomiao-xi",
    name: "火苗蜥",
    title: "完成 9 轮",
    intro: "头顶有小火苗，答题越稳定，火光越亮。",
    unlockText: "完成 9 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 9,
    image: fireLizardImage,
    tone: "flame"
  },
  {
    id: "shigu-gui",
    name: "石鼓龟",
    title: "完成 12 轮",
    intro: "背壳像小石鼓，最喜欢一步一步稳稳前进。",
    unlockText: "完成 12 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 12,
    image: stoneTurtleImage,
    tone: "stone"
  },
  {
    id: "modian-zhang",
    name: "墨点章",
    title: "完成 15 轮",
    intro: "身上有发光墨点，常常盯着容易看错的符号。",
    unlockText: "完成 15 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 15,
    image: inkOctoImage,
    tone: "ink"
  },
  {
    id: "yuanli-xiong",
    name: "圆栗熊",
    title: "连续 7 天",
    intro: "背着栗壳的小伙伴，只有每天都回来的人能遇到它。",
    unlockText: "连续 7 天完成每日挑战后获得",
    unlockKind: "streak",
    requirement: 7,
    image: chestnutBearImage,
    tone: "sprout"
  },
  {
    id: "shanhu-wa",
    name: "珊瑚蛙",
    title: "完成 18 轮",
    intro: "腮边长着珊瑚枝，遇到错题会轻轻拍水花提醒。",
    unlockText: "完成 18 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 18,
    image: coralFrogImage,
    tone: "coral"
  },
  {
    id: "xingke-luo",
    name: "星壳螺",
    title: "完成 21 轮",
    intro: "背着星空螺壳，喜欢把每天的进步一点点收进去。",
    unlockText: "完成 21 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 21,
    image: starSnailImage,
    tone: "shell"
  },
  {
    id: "yingye-long",
    name: "萤叶龙",
    title: "完成 24 轮",
    intro: "翅膀像透明叶片，尾巴会在快速答对时亮一下。",
    unlockText: "完成 24 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 24,
    image: leafDrakeImage,
    tone: "leaf"
  },
  {
    id: "wujiao-yang",
    name: "雾角羊",
    title: "连续 14 天",
    intro: "弯角像两团云雾，只会靠近长期坚持的小朋友。",
    unlockText: "连续 14 天完成每日挑战后获得",
    unlockKind: "streak",
    requirement: 14,
    image: mistLambImage,
    tone: "mist"
  },
  {
    id: "shazhong-xie",
    name: "沙钟蟹",
    title: "完成 27 轮",
    intro: "背壳像小沙钟，最懂得把速度和准确放在一起。",
    unlockText: "完成 27 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 27,
    image: hourglassCrabImage,
    tone: "sand"
  },
  {
    id: "lingguang-yao",
    name: "棱光鳐",
    title: "完成 30 轮",
    intro: "鳍边会折出彩光，答题越专注，颜色越清亮。",
    unlockText: "完成 30 轮每日挑战后获得",
    unlockKind: "rounds",
    requirement: 30,
    image: prismRayImage,
    tone: "prism"
  },
  {
    id: "yueya-lu",
    name: "月芽鹿",
    title: "第一次全对",
    intro: "角像弯月，喜欢悄悄记录第一次全对的瞬间。",
    unlockText: "第一次每日挑战全对后获得",
    unlockKind: "achievement",
    requirement: 1,
    achievementKey: "firstPerfect",
    image: moonDeerImage,
    tone: "moon"
  },
  {
    id: "dianguang-hu",
    name: "电光狐",
    title: "5 分钟内完成",
    intro: "尾巴像闪电，专门为又快又准的挑战者出现。",
    unlockText: "5 分钟内完成每日挑战后获得",
    unlockKind: "achievement",
    requirement: 1,
    achievementKey: "speedUnder5",
    image: lightningFoxImage,
    tone: "bolt"
  },
  {
    id: "fengling-niao",
    name: "风铃鸟",
    title: "符号零失误",
    intro: "身体像小铃铛，会提醒大家先看清符号。",
    unlockText: "一次挑战中没有看错符号后获得",
    unlockKind: "achievement",
    requirement: 1,
    achievementKey: "cleanSigns",
    image: windBirdImage,
    tone: "wind"
  }
];

export function getBuddy(id: string) {
  return buddies.find((buddy) => buddy.id === id) ?? buddies[0];
}

export function getNextLockedBuddy(unlockedBuddyIds: string[]) {
  return buddies.find((buddy) => buddy.unlockKind !== "starter" && !unlockedBuddyIds.includes(buddy.id));
}
