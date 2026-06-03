import type { Problem, SkillTag, StageConfig } from "../types";

let idCounter = 0;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeInputProblem(
  prompt: string,
  answer: number,
  skill: SkillTag,
  hint: string,
  explanation: string,
  expression = prompt,
  wrongSignAnswer?: number
): Problem {
  idCounter += 1;
  return {
    id: `p-${Date.now()}-${idCounter}`,
    prompt,
    answer,
    type: "input",
    skill,
    expression,
    wrongSignAnswer,
    hint,
    explanation
  };
}

function makeBorrowProblem(minuend?: number, subtrahend?: number) {
  let a = minuend ?? 0;
  let b = subtrahend ?? 0;

  if (!minuend || !subtrahend) {
    const tensA = randomInt(4, 9);
    const onesA = randomInt(1, 8);
    const tensB = randomInt(1, tensA - 1);
    const onesB = randomInt(onesA + 1, 9);
    a = tensA * 10 + onesA;
    b = tensB * 10 + onesB;
  }

  const answer = a - b;
  const onesA = a % 10;
  const tensA = Math.floor(a / 10);
  const onesB = b % 10;
  const tensB = Math.floor(b / 10);
  const borrowedOnes = onesA + 10;
  const remainingTens = tensA - 1;
  const resultOnes = borrowedOnes - onesB;
  const resultTens = remainingTens - tensB;

  return makeInputProblem(
    `${a} - ${b}`,
    answer,
    "borrow",
    `个位 ${onesA} 不够减 ${onesB}，需要退位。`,
    `${borrowedOnes} - ${onesB} = ${resultOnes}，${remainingTens} - ${tensB} = ${resultTens}，所以答案是 ${answer}。`,
    `${a} - ${b}`,
    a + b
  );
}

function makeCarryProblem() {
  const tens = randomInt(2, 7);
  const ones = randomInt(5, 9);
  const add = randomInt(10 - ones, 18);
  const a = tens * 10 + ones;
  const answer = a + add;

  return makeInputProblem(
    `${a} + ${add}`,
    answer,
    "carry",
    `个位 ${ones} 加 ${add % 10} 会满 10，记得向十位进 1。`,
    `${ones} + ${add % 10} 需要进位，所以 ${a} + ${add} = ${answer}。`,
    `${a} + ${add}`,
    Math.abs(a - add)
  );
}

function makeSimplePlus() {
  const base = randomInt(18, 68);
  const add = randomInt(4, 18);
  return makeInputProblem(
    `${base} + ${add}`,
    base + add,
    "numberSense",
    "看清符号，是加号。",
    `${base} + ${add} = ${base + add}。`,
    `${base} + ${add}`,
    Math.abs(base - add)
  );
}

function makeTensPlus() {
  const base = randomInt(14, 79);
  const add = randomInt(1, 3) * 10;
  return makeInputProblem(
    `${base} + ${add}`,
    base + add,
    "numberSense",
    "先看十位有没有变化。",
    `${base} 加 ${add}，就是十位增加，所以答案是 ${base + add}。`,
    `${base} + ${add}`
  );
}

function makeSimpleMinus() {
  const tens = randomInt(3, 8);
  const ones = randomInt(3, 9);
  const remove = randomInt(1, ones);
  const a = tens * 10 + ones;
  return makeInputProblem(
    `${a} - ${remove}`,
    a - remove,
    "numberSense",
    "个位够减，先算个位。",
    `${a} 减 ${remove}，个位 ${ones} 减 ${remove} 得 ${ones - remove}，答案是 ${a - remove}。`,
    `${a} - ${remove}`
  );
}

function makeMultiplication() {
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  return makeInputProblem(`${a} × ${b}`, a * b, "multiplyDivide", `想 ${a} 乘 ${b} 的口诀。`, `${a} × ${b} = ${a * b}。`, `${a} × ${b}`);
}

function makeDivision() {
  const divisor = randomInt(2, 9);
  const quotient = randomInt(2, 9);
  const dividend = divisor * quotient;
  return makeInputProblem(
    `${dividend} ÷ ${divisor}`,
    quotient,
    "multiplyDivide",
    `想 ${divisor} 乘几等于 ${dividend}。`,
    `${divisor} × ${quotient} = ${dividend}，所以答案是 ${quotient}。`,
    `${dividend} ÷ ${divisor}`
  );
}

function makeProblemForSkill(skill: SkillTag) {
  if (skill === "borrow") return makeBorrowProblem();
  if (skill === "carry") return makeCarryProblem();
  if (skill === "multiplyDivide") return Math.random() > 0.5 ? makeMultiplication() : makeDivision();
  if (skill === "speed") return shuffle([makeTensPlus(), makeSimpleMinus(), makeMultiplication(), makeDivision()])[0];
  if (skill === "attention") return shuffle([makeSimplePlus(), makeSimpleMinus(), makeBorrowProblem(), makeDivision()])[0];
  return shuffle([makeTensPlus(), makeSimplePlus(), makeSimpleMinus()])[0];
}

function makeFocusProblems(focusSkills: SkillTag[], count: number) {
  const usable: SkillTag[] = focusSkills.length > 0 ? focusSkills : ["borrow"];
  return Array.from({ length: count }, (_, index) => makeProblemForSkill(usable[index % usable.length]));
}

export function createStages(focusSkills: SkillTag[] = []): StageConfig[] {
  idCounter = 0;

  const warmup = shuffle([makeTensPlus(), makeSimpleMinus(), makeMultiplication(), makeDivision(), makeCarryProblem()]);
  const main = shuffle([
    makeCarryProblem(),
    makeSimplePlus(),
    makeSimpleMinus(),
    makeBorrowProblem(),
    makeMultiplication(),
    makeMultiplication(),
    makeDivision(),
    makeDivision(),
    ...makeFocusProblems(focusSkills, 2)
  ]);
  const challenge = shuffle([makeSimplePlus(), makeBorrowProblem(), makeMultiplication(), makeDivision(), makeProblemForSkill(focusSkills[0] ?? "numberSense")]);

  return [
    {
      id: "warmup",
      title: "热身关",
      subtitle: "先点亮状态",
      scene: "基础加减乘除混合",
      modeLabel: "5 题",
      goalText: "热身完成，状态点亮！",
      problems: warmup
    },
    {
      id: "main",
      title: "今日挑战",
      subtitle: "伙伴同行",
      scene: focusSkills.length > 0 ? "加减乘除混合，薄弱点加练" : "加减乘除混合练习",
      modeLabel: "10 题",
      goalText: "加减乘除都练到",
      problems: main
    },
    {
      id: "challenge",
      title: "星星挑战",
      subtitle: "稳稳模式",
      scene: "准确优先",
      modeLabel: "5 连对",
      goalText: "连续答对 5 题拿星星",
      problems: challenge
    }
  ];
}

export function isCorrectAnswer(problem: Problem, value: string) {
  if (problem.type !== "input") return false;
  return Number(value) === Number(problem.answer);
}

export function classifyMistake(problem: Problem, value: string) {
  const numeric = Number(value);
  if (problem.wrongSignAnswer !== undefined && numeric === problem.wrongSignAnswer) {
    return "你可能把符号看错了。下次先看 + 还是 -，再看数字。";
  }
  return undefined;
}
