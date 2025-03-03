import { useState } from 'react';
import "./ProductCard.css";
import quickViewIcon from "../../assets/magnifying-glass.png";
import addToCartIcon from "../../assets/add-to-cart (1).png";
import ImageSlider from '../ImageSlider/ImageSlider';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/Product';

interface Props {
  product: Product;
  parentBreadcrumb: string;
}

function ProductCard({product}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Get the first available size and color from the product's inventory
  const selectedSize = product.inventory.length > 0 ? product.inventory[0].size : 'M'; // Default to 'M' if no inventory
  const selectedColor = product.inventory.length > 0 ? product.inventory[0].color : 'Red'; // Default to 'Red' if no inventory

  const handleCardClick = () => {
    const path = `/${product.type}/${product.id}`;
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
          <ImageSlider images={[product.image]} />
        </div>
        <h4 className="card-title">{product.brandid}</h4>
        <div className="card-body">
          <p className="card-text">{product.name}</p>
          <div className="card-price-actions">
            <p className="card-price">₹ {product.listprice}</p>
            {isHovered && (
              <div className="card-actions">
                <button className="quick-view-btn" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={quickViewIcon}
                    alt="Quick View"
                    className="quick-view-icon"
                  />
                </button>
                <button 
                  className="add-to-cart-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, selectedSize, selectedColor); // Use the selected size and color
                  }}
                >
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
