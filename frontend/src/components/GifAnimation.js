import React, { useEffect, useState } from 'react';

const GifAnimation = ({ isAnimating }) => {
  const images = [
    '/rainy1.png',
    '/rainy2.png',
    '/rainy1.png',
    '/rainy3.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const frameDuration = 150; // Duration of each frame in milliseconds

  useEffect(() => {
    let interval = null;

    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, frameDuration);
    } else {
      setCurrentImageIndex(0); // Reset to the first frame when stopped
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnimating]);

  return (
    isAnimating && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Frame ${currentImageIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    )
  );
};

export default GifAnimation;
