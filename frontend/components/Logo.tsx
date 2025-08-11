export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 36 36" 
          fill="none"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="url(#logoGradient)"
            stroke="white"
            strokeWidth="2"
          />
          <path 
            d="M12 18l4 4 8-8" 
            stroke="white" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle 
            cx="18" 
            cy="8" 
            r="2" 
            fill="white" 
            opacity="0.8"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          CBTC
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">
          Excellence Entrepreneuriale
        </span>
      </div>
    </div>
  );
}
