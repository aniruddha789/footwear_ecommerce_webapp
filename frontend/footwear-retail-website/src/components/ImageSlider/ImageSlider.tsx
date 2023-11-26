import Carousel from "react-bootstrap/Carousel";

import "./ImageSlider.css";
// import offwhite1 from '../../../src/assets/300952867OFFWHITE_1.webp';
// import offwhite2 from '../../../src/assets/300952867OFFWHITE_2.webp';
// import offwhite3 from '../../../src/assets/300952867OFFWHITE_3.webp';

interface props {
  img1 :string;
  img2: string;
  img3: string;
}

function ImageSlider({img1, img2, img3}: props) {
  return (

    <Carousel data-bs-theme="dark" nextIcon={null} prevIcon={null} touch={true}>
      <Carousel.Item>
        <div>
          <img
            className="img-fluid"
            src={img1}
            alt="First slide"
          />
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="img-fluid"
          src={img2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="img-fluid"
          src={img3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageSlider;
