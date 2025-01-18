import React from 'react';

const AdBanner = () => {
  return (
    <div className="w-full">
      <svg 
        viewBox="0 0 1200 150" 
        className="w-full h-auto"
        style={{ maxHeight: '150px' }}
      >
        <rect width="100%" height="100%" fill="#2563eb" />
        <text 
          x="50%" 
          y="50%" 
          fill="#1C1240" 
          fontSize="32" 
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          🎉 Special Offer! 20% Off All Events 🎉
        </text>
      </svg>
    </div>
  );
};

export default AdBanner;
