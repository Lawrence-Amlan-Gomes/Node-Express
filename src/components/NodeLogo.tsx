export default function NodeLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="50,4 91,27 91,73 50,96 9,73 9,27"
        fill="#141414"
        stroke="#539E43"
        strokeWidth={4}
      />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fontFamily="ui-monospace, SF Mono, monospace"
        fontWeight={700}
        fontSize="42"
        fill="#539E43"
      >
        N
      </text>
    </svg>
  );
}
