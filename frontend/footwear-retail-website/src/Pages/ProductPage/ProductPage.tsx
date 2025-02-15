import React, { useState, useEffect } from 'react';
import './ProductPage.css';
import { getProductById } from '../../services/api';
import { Product } from '../../types/Product';
import { useParams } from 'react-router-dom';
import ImageSliderPopup from '../../components/ImageSliderPopup/ImageSliderPopup';
import useIsMobile from '../../hooks/useIsMobile'; // Import the custom hook
import shipping_icon from '../../assets/fast-delivery.png'
import returns_icon from '../../assets/return-box.png'
import fashion_icon from '../../assets/clean-clothes.png'
import { colorMap } from '../../utils/colorMap'
import { useCart } from '../../context/CartContext';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const isMobile = useIsMobile(); // Use the custom hook
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const fetchedProduct = await getProductById(Number(id));
          setProduct(fetchedProduct);
          console.log("Inventory: " + fetchedProduct.inventory);
          
          // Set initial selected color and size
          const selectedInventory = fetchedProduct.inventory.find(item => item.image === fetchedProduct.image);
          if (selectedInventory) {
            setSelectedColor(selectedInventory.color);
            setSelectedSize(selectedInventory.size);
          }
        }
      } catch (err) {
        setError('Failed to fetch product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  // Define the sorted order of sizes
  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', 'UK7', 'UK8', 'UK9'];

  // Sort the inventory based on the defined size order
  const sortedInventory = product.inventory.sort((a, b) => {
    return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
  });



  // Get the color from the selected inventory item
  // const selectedColor = selectedInventory ? selectedInventory.color : '';

  // // Get the hex color from the map
  // const colorHex = colorMap[selectedColor.toLowerCase()] || "#000000"; // Default to black if not found

  const getColorHex = (colorString: string): string => {
    const lowerCaseColor = colorString.toLowerCase();
    return colorMap[lowerCaseColor] || "#000000"; // Default to black if not found
  }

  return (
    <div className={`product-page ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="product-images">
        {isMobile ? (
          <img
            src={product.image}
            alt={product.name}
            className="grid-image"
            onClick={() => setShowSlider(true)}
          />
        ) : (
          <>
            <img src={product.image} alt={product.name} className="grid-image" />
            <img src={product.image} alt={product.name} className="grid-image" />
            <img src={product.image} alt={product.name} className="grid-image" />
            <img src={product.image} alt={product.name} className="grid-image" />
          </>
        )}
      </div>
      <div className="product-details">
        <h2 className="brand">{product.brandid}</h2>
        <h1 className="product-name">{product.name}</h1>
        <p className="price">₹ {product.listprice} <span className="mrp">MRP incl. of all taxes</span></p>
        <div className="color-section">
          <p className="color-label">COLOURS</p>
          <div className="color-options">
            {Array.from(new Set(sortedInventory.map(item => item.color))).map(color => (
              <div
                key={color}
                className={`color-option ${color === selectedColor ? 'selected' : ''}`}
                style={{ backgroundColor: getColorHex(color) }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>
        </div>
        <div className="size-section">
          <p className="size-label">SIZE <span className="size-guide">SIZE GUIDE</span></p>
          <div className="size-options">
            {Array.from(new Set(sortedInventory.map(item => item.size))).map(size => (
              <button
                key={size}
                className={`size-option ${size === selectedSize ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <button 
          className="add-to-bag"
          onClick={() => {
            if (!selectedSize || !selectedColor) {
              alert('Please select both size and color');
              return;
            }
            addToCart(product, selectedSize, selectedColor);
          }}
        >
          ADD TO BAG
        </button>
        <div className="product-features">
          <div className="feature">
            <img src={shipping_icon} alt="Free shipping" />
            <p>Free shipping</p>
          </div>
          <div className="feature">
            <img src={returns_icon} alt="Easy Returns" />
            <p>Easy Returns</p>
          </div>
          <div className="feature">
            <img src={fashion_icon} alt="Fresh Fashion" />
            <p>Fresh Fashion</p>
          </div>
        </div>
      </div>
      {showSlider && (
        <ImageSliderPopup
          images={[product.image, product.image, product.image, product.image]}
          onClose={() => setShowSlider(false)}
        />
      )}
    </div>
  );
};

export default ProductPage;