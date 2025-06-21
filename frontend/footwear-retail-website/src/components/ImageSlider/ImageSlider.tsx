import Carousel from "react-bootstrap/Carousel";

import "./ImageSlider.css";
// import offwhite1 from '../../../src/assets/300952867OFFWHITE_1.webp';
// import offwhite2 from '../../../src/assets/300952867OFFWHITE_2.webp';
// import offwhite3 from '../../../src/assets/300952867OFFWHITE_3.webp';

interface Props {
  images: string[], 
  onClick?: () => void;  // Optional click handler
  initialIndex?: number; // Add this prop
}
function ImageSlider({ images, onClick, initialIndex = 0 }: Props) {
  const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const generateSrcSet = (img: string) => {
    console.log("images:" + images);
    return `${img}?width=240&height=320 240w, 
            ${img}?width=480&height=640 480w, 
            ${img}?width=720&height=960 720w, 
            ${img}?width=960&height=1280 960w, 
            ${img}?width=1200&height=1600 1200w`;
  };
            
  return (
    <Carousel 
      data-bs-theme="dark" 
      nextIcon={null} 
      prevIcon={null} 
      touch={true} 
      className="custom-carousel"
      onClick={onClick}
      defaultActiveIndex={initialIndex}
    >
      {images.map((img, index) => (
        <Carousel.Item key={index}>
          <img
            className="img-fluid"
            src={img}
            srcSet={generateSrcSet(img)}
            sizes={imageSizes}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ImageSlider;
