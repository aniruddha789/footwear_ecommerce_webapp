import Carousel from "react-bootstrap/Carousel";

import "./ImageSlider.css";

function ImageSlider() {
  return (
    <Carousel data-bs-theme="dark" nextIcon={null} prevIcon={null} touch={true}>
      <Carousel.Item>
        <div>
          <img
            className="img-fluid"
            src="/src/assets/300952867OFFWHITE_1.webp"
            alt="First slide"
          />
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="img-fluid"
          src="/src/assets/300952867OFFWHITE_2.webp"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="img-fluid"
          src="/src/assets/300952867OFFWHITE_3.webp"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageSlider;
