import Carousel from "react-bootstrap/Carousel";

import "./ImageSlider.css";
// import offwhite1 from '../../../src/assets/300952867OFFWHITE_1.webp';
// import offwhite2 from '../../../src/assets/300952867OFFWHITE_2.webp';
// import offwhite3 from '../../../src/assets/300952867OFFWHITE_3.webp';

interface Props {
  img1: string;
  img2: string;
  img3: string;
}
function ImageSlider({ img1, img2, img3 }: Props) {
  const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const generateSrcSet = (img: string) => {
    return `${img}?width=240&height=320 240w, 
            ${img}?width=480&height=640 480w, 
            ${img}?width=720&height=960 720w, 
            ${img}?width=960&height=1280 960w, 
            ${img}?width=1200&height=1600 1200w`;
  };
            
  return (
    <Carousel data-bs-theme="dark" nextIcon={null} prevIcon={null} touch={true} className="custom-carousel">
      {[img1, img2, img3].map((img, index) => (
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
