import React, { useState, useEffect } from 'react';
import './ProductPage.css';
import { getProductById } from '../../services/api';
import { Product } from '../../types/Product';
import { useParams } from 'react-router-dom';
import ImageSliderPopup from '../../components/ImageSliderPopup/ImageSliderPopup';
import useIsMobile from '../../hooks/useIsMobile'; // Import the custom hook

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
        <h2>{product.brandid}</h2>
        <h1>{product.name}</h1>
        <p className="price">₹ {product.listprice} <span className="mrp">MRP incl. of all taxes</span></p>
        <p className="color">Color: {product.color}</p>
        <p className="description">{product.description}</p>
        <button className="add-to-cart">Add to Cart</button>
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