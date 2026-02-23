import { useEffect } from "react";


const ConfettiBurst = ({ show, onDone }) => {
  const colors = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#ffffff"];
  const pieces = Array.from({ length: 44 }, (_, i) => i);

  useEffect(() => {
    if (!show)
        return;
    const timer = setTimeout(() => {
      onDone?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show)
      return null;

  return (
    <div className="confettiWrap">
      {pieces.map((i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 180 + Math.random() * 140;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <span
            key={i}
            className="confettiPiece"
            style={{
              background: colors[i % colors.length],
              "--x": `${x}px`,
              "--y": `${y}px`,
              animationDelay: `${Math.random() * 0.08}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiBurst;
