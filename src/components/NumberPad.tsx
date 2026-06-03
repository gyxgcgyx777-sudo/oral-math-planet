import { Delete } from "lucide-react";

interface NumberPadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  disabled?: boolean;
  canDelete?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function NumberPad({ onDigit, onBackspace, onConfirm, disabled, canDelete }: NumberPadProps) {
  return (
    <div className="number-pad">
      {keys.map((key) => (
        <button type="button" key={key} onClick={() => onDigit(key)} disabled={disabled}>
          {key}
        </button>
      ))}
      <button type="button" className="utility-key" onClick={onBackspace} disabled={disabled || !canDelete} aria-label="删一位">
        <Delete size={24} />
        删一位
      </button>
      <button type="button" onClick={() => onDigit("0")} disabled={disabled}>
        0
      </button>
      <button type="button" className="confirm-key" onClick={onConfirm} disabled={disabled}>
        确认
      </button>
    </div>
  );
}
