interface IconProps {
  className?: string;
}

export function BookIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TargetIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function StarIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  );
}

export function RocketIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 16.5C3 14 2.5 11.5 2.5 9C2.5 6.5 3.5 4 6 2C8.5 4.5 10 8 10 12M4.5 16.5L7.5 19.5M4.5 16.5L2 22L7.5 19.5M7.5 19.5C10 21 12.5 21.5 15 21.5C17.5 21.5 20 20.5 22 18C19.5 15.5 16 14 12 14M10 12L12 14M10 12C10 8 8.5 4.5 6 2M12 14C16 14 19.5 15.5 22 18C20.5 20.5 17.5 21.5 15 21.5C12.5 21.5 10 21 7.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function LightbulbIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18H15M10 22H14M12 2C8.68629 2 6 4.68629 6 8C6 10.5 7 12 8 14C8.5 14.5 9 15.5 9 16V18H15V16C15 15.5 15.5 14.5 16 14C17 12 18 10.5 18 8C18 4.68629 15.3137 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PaletteIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12.83 22 13.5 21.33 13.5 20.5C13.5 20.1 13.35 19.74 13.11 19.46C12.88 19.19 12.74 18.83 12.74 18.44C12.74 17.61 13.41 16.94 14.24 16.94H16C19.31 16.94 22 14.25 22 10.94C22 6.06 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
      <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
      <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
      <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function TrophyIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9M6 9V3H18V9M6 9H3C3 10 3.5 12 5 12M18 9H21C21 10 20.5 12 19 12M12 15V19M12 19H8M12 19H16M8 19V21H16V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CelebrationIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 5.5L3 3M18.5 5.5L21 3M12 3V1M5 12H3M21 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 21L9 19L7 17L5 19L7 21Z" fill="currentColor"/>
      <path d="M17 21L19 19L17 17L15 19L17 21Z" fill="currentColor"/>
      <path d="M12 23L14 21L12 19L10 21L12 23Z" fill="currentColor"/>
      <rect x="6" y="7" width="2" height="2" rx="1" fill="currentColor"/>
      <rect x="16" y="7" width="2" height="2" rx="1" fill="currentColor"/>
      <rect x="11" y="5" width="2" height="2" rx="1" fill="currentColor"/>
    </svg>
  );
}

export function SparklesIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 2L10.5 6L14.5 7L10.5 8L9.5 12L8.5 8L4.5 7L8.5 6L9.5 2Z"/>
      <path d="M17 6L17.5 8.5L20 9L17.5 9.5L17 12L16.5 9.5L14 9L16.5 8.5L17 6Z"/>
      <path d="M14 14L15 18L19 19L15 20L14 24L13 20L9 19L13 18L14 14Z"/>
    </svg>
  );
}

export function GlowingStarIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path filter="url(#glow)" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8"/>
    </svg>
  );
}

export function BalloonIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.68629 2 6 4.91015 6 8.5C6 11.5 8 14 10 16C10.6667 16.6667 11 17.3333 11 18V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V18C13 17.3333 13.3333 16.6667 14 16C16 14 18 11.5 18 8.5C18 4.91015 15.3137 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 20L10 24H14L12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6C8 6 9 4 10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function HeartIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"/>
    </svg>
  );
}

export function PeaceIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2V12M12 12L6 18M12 12L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SuccessIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

export function GoalIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <circle cx="6.5" cy="6.5" r="0.5" fill="currentColor"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      <circle cx="6.5" cy="17.5" r="0.5" fill="currentColor"/>
      <circle cx="17.5" cy="17.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}
