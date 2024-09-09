import { useState } from 'react';
import "./ProductCard.css";
import quickViewIcon from "../../assets/magnifying-glass.png";
import addToCartIcon from "../../assets/add-to-cart (1).png";
import ImageSlider from '../ImageSlider/ImageSlider';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  name: string;
  desc: string;
  brandid: string;
  price: number;
  img1: string;
  img2: string;
  img3: string;
  category: string;
  parentBreadcrumb: string;
}

function ProductCard(props: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    //const path = props.parentBreadcrumb.trim() ? `/${props.parentBreadcrumb}/${props.id}` : `/${props.id}`;
    const path = `/${props.category}/${props.id}`;
    navigate(path);
  };

  return (
    <div
      className="b"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="cardProduct">
        <div className="productImg">
          <ImageSlider img1={props.img1} img2={props.img2} img3={props.img3} />
        </div>
        <h4 className="card-title">{props.brandid}</h4>
        <div className="card-body">
          <p className="card-text">{props.name}</p>
          <div className="card-price-actions">
            <p className="card-price">₹ {props.price}</p>
            {isHovered && (
              <div className="card-actions">
                <button className="quick-view-btn" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={quickViewIcon}
                    alt="Quick View"
                    className="quick-view-icon"
                  />
                </button>
                <button className="add-to-cart-btn" onClick={(e) => e.stopPropagation()}>
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
