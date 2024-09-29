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
     <ImageSlider images={[images[0], images[1], images[2]]}/>
    </div>
  );
};

export default ImageSliderPopup;