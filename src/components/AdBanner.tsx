import React from 'react';

const AdBanner = () => {
  return (
    <div className="w-full">
      <img
        src="https://agendasalvador.netlify.app/banner-holder.png"
        alt="Special Offer Banner"
        className="w-full h-auto"
        style={{ maxHeight: '150px' }}
      />
    </div>
  );
};

export default AdBanner;
