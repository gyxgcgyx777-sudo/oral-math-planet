import { Award, Cat, Sparkles } from "lucide-react";
import type { TabKey } from "../types";

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const items: Array<{ key: TabKey; label: string; Icon: typeof Sparkles }> = [
  { key: "today", label: "今日", Icon: Sparkles },
  { key: "pet", label: "伙伴", Icon: Cat },
  { key: "achievements", label: "成就", Icon: Award }
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="学习端导航">
      {items.map(({ key, label, Icon }) => (
        <button
          className={`nav-item ${active === key ? "is-active" : ""}`}
          key={key}
          type="button"
          onClick={() => onChange(key)}
        >
          <Icon size={22} strokeWidth={2.4} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
