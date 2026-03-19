export function IconFloat({ symbol, top, left, delay }: { symbol: string; top: string; left: string; delay: string }) {
  return (
    <span
      className="float-icon absolute text-2xl opacity-60"
      style={{ top, left, animationDelay: delay }}
      aria-hidden
    >
      {symbol}
    </span>
  );
}
