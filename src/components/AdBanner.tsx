import React, { useState, useEffect } from 'react';

const AdBanner = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <div 
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <svg 
        viewBox="0 0 1200 150" 
        className="w-full h-auto"
        style={{ maxHeight: '150px' }}
      >
        <rect width="100%" height="100%" fill="#2563eb" />
        <text 
          x="50%" 
          y="50%" 
          fill="white" 
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
