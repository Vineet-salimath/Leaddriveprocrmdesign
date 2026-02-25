export function DealynxLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Premium gradient background circle */}
      <defs>
        <linearGradient id="dealynxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
        </linearGradient>
        <filter id="dealynxShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="18" cy="18" r="18" fill="url(#dealynxGradient)" filter="url(#dealynxShadow)" />

      {/* Premium car silhouette - sleek sports car profile */}
      <g filter="url(#dealynxShadow)">
        {/* Car body - side profile */}
        <path
          d="M 10 20 L 12 16 L 15 14 L 22 14 L 25 16 L 26 18 L 26 22 C 26 23.2 25.2 24 24 24 L 12 24 C 10.8 24 10 23.2 10 22 Z"
          fill="white"
          opacity="0.95"
          strokeWidth="0.5"
          stroke="rgba(255,255,255,0.3)"
        />

        {/* Windshield - premium glass appearance */}
        <path
          d="M 13 16 L 15 14.5 L 22 14.5 L 23.5 16 Z"
          fill="rgba(255,255,255,0.4)"
          strokeWidth="0.5"
          stroke="rgba(255,255,255,0.5)"
        />

        {/* Rear window */}
        <path
          d="M 19 16 L 22 15.5 L 23.5 18 L 20 18 Z"
          fill="rgba(255,255,255,0.35)"
          strokeWidth="0.5"
          stroke="rgba(255,255,255,0.4)"
        />

        {/* Front wheel - detailed rim */}
        <circle cx="13" cy="24" r="3" fill="white" opacity="0.9" />
        <circle cx="13" cy="24" r="2.2" fill="#6366F1" opacity="0.4" />
        <circle cx="13" cy="24" r="1.5" fill="white" opacity="0.7" />

        {/* Back wheel - detailed rim */}
        <circle cx="23" cy="24" r="3" fill="white" opacity="0.9" />
        <circle cx="23" cy="24" r="2.2" fill="#6366F1" opacity="0.4" />
        <circle cx="23" cy="24" r="1.5" fill="white" opacity="0.7" />

        {/* Headlight - premium accent */}
        <circle cx="10.5" cy="18.5" r="1" fill="white" opacity="0.8" />

        {/* Premium accent line - hood */}
        <path
          d="M 11 18 Q 18 17 25 18"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />

        {/* Bottom accent - side profile */}
        <path
          d="M 10 22 Q 18 22.5 26 22"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />
      </g>

      {/* Shine overlay for premium glass effect */}
      <ellipse cx="16" cy="15" rx="3" ry="1.5" fill="white" opacity="0.25" />
    </svg>
  );
}
