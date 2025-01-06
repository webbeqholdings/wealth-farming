// Spinner.tsx
import React from 'react'

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <svg
          className="animate-spin h-16 w-16 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
        >
          <circle
            className="opacity-25"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="opacity-75"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="125, 200"
            strokeDashoffset="0"
            style={{
              animation: 'dash 1.5s ease-in-out infinite',
            }}
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
      </div>
    </div>

  )
}

export default Spinner
