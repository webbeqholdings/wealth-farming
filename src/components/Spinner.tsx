// Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
    >
      <svg
        className="animate-spin h-16 w-16 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 50 50"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
        />
        <circle
          className="opacity-75"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="125, 200"
          strokeDashoffset="0"
          style={{ animation: 'dash 1.5s ease-in-out infinite' }}
        />
        <style jsx>{`
          @keyframes dash {
            0% {
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 100, 200;
              stroke-dashoffset: -15;
            }
            100% {
              stroke-dasharray: 100, 200;
              stroke-dashoffset: -125;
            }
          }
        `}</style>
      </svg>
      <span className="mt-4 text-lg text-gray-700">Loading...</span>
    </div>
  );
};

export default Spinner;
