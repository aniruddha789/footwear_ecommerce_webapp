import "./ProductCard.css";
import ImageSlider from "../ImageSlider/ImageSlider";
import { useState } from "react";
//import Quantity from "../Quantity/Quantity";
import quickViewIcon from "../../assets/magnifying-glass.png";
import addToCartIcon from "../../assets/add-to-cart (1).png";

interface Props {
  name: string;
  text: string;
  price: number;
  img1: string;
  img2: string;
  img3: string;
}

function ProductCard(props: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="b"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cardProduct">
        <div className="productImg">
          <ImageSlider img1={props.img1} img2={props.img2} img3={props.img3} />
        </div>
        <h4 className="card-title">{props.name}</h4>
        <div className="card-body">
          <p className="card-text">{props.text}</p>
          <div className="card-price-actions">
            <p className="card-price">₹ {props.price}</p>
            {isHovered && (
  <div className="card-actions">
    <button className="quick-view-btn">
      <img
        src={quickViewIcon}
        alt="Quick View"
        className="quick-view-icon"
      />
    </button>
    <button className="add-to-cart-btn">
      <img
        src={addToCartIcon}
        alt="Add to Cart"
        className="add-to-cart-icon"
      />
    </button>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
