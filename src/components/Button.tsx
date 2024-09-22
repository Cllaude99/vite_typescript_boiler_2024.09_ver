export interface ButtonType {
  readonly text: string;
  readonly isLoading: boolean;
  readonly onClick?: () => void;
}

export default function Button({ text, isLoading, onClick }: ButtonType) {
  return (
    <button
      type="submit"
      className="min-h-10 primary-btn disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? '잠시만 기다려 주세요...' : text}
    </button>
  );
}
