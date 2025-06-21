import React from 'react';
import './ImageSliderPopup.css';
import ImageSlider from  '../ImageSlider/ImageSlider';

interface ImageSliderProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageSliderPopup: React.FC<ImageSliderProps> = ({ images, initialIndex = 0, onClose }) => {
  return (
    <div className="image-slider-overlay" onClick={onClose}>
      <div className="image-slider-container">
        <ImageSlider images={images} initialIndex={initialIndex} />
      </div>
    </div>
  );
};

export default ImageSliderPopup;