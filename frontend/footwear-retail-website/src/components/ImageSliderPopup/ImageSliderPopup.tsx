import React from 'react';
import './ImageSliderPopup.css';
import ImageSlider from  '../ImageSlider/ImageSlider';

interface ImageSliderProps {
  images: string[];
  onClose: () => void;
}

const ImageSliderPopup: React.FC<ImageSliderProps> = ({ images, onClose }) => {
  return (
    <div className="image-slider-overlay" onClick={onClose}>
      <div className="image-slider-container">
        <ImageSlider images={images} />
      </div>
    </div>
  );
};

export default ImageSliderPopup;