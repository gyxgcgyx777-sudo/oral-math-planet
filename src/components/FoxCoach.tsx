import { getBuddy } from "../data/buddies";

interface FoxCoachProps {
  size?: "small" | "medium" | "large";
  className?: string;
  buddyId?: string;
}

export default function FoxCoach({ size = "medium", className = "", buddyId = "xinglumiao" }: FoxCoachProps) {
  const buddy = getBuddy(buddyId);
  return <img className={`fox-image ${size} ${className}`} src={buddy.image} alt={buddy.name} />;
}
