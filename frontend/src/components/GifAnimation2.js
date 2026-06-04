import React, { useEffect, useState } from 'react';

const GifSunAnimation = ({ isAnimating }) => {
  const images = [
    '/sun1.png',
    '/sun2.png',
    '/sun3.png',
    '/sun4.png',
    '/sun5.png',
    '/sun6.png',
    '/sun7.png',
    '/sun8.png',
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
          position: 'absolute', // Use absolute positioning
          top: '50%', // Center vertically
          left: '50%', // Center horizontally
          transform: 'translate(-50%, -50%)', // Offset by 50% of width and height
          width: '200px', // Set a fixed width for the animation
          height: '200px', // Set a fixed height for the animation
          zIndex: 9999, // Ensure it stays above other elements
          pointerEvents: 'none', // Ignore pointer events
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Frame ${currentImageIndex + 1}`}
          style={{
            objectFit: 'cover',
            width: '100%', // Ensure the image fits the container
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    )
  );
};

export default GifSunAnimation;
