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


const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const isMobile = useIsMobile(); // Use the custom hook

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const fetchedProduct = await getProductById(Number(id));
          setProduct(fetchedProduct);
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
            <div className="color-option" style={{backgroundColor: product.color}}></div>
          </div>
        </div>
        <div className="size-section">
          <p className="size-label">SIZE <span className="size-guide">SIZE GUIDE</span></p>
          <div className="size-options">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button key={size} className="size-option">{size}</button>
            ))}
          </div>
        </div>
        <button className="add-to-bag">ADD TO BAG</button>
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