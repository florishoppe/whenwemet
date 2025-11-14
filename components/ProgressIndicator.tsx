interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      <span className="text-sm text-[#F5E8DC]/80 font-medium">
        VRAAG {current} VAN {total}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-all ${
              index + 1 <= current
                ? 'bg-[#F97068] shadow-[0_0_10px_rgba(249,112,104,0.5)]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

