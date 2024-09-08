import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import { getProductById } from '../../services/api';
import { Product } from '../../types/Product';

const ProductPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const fetchedProduct = await getProductById(parseInt(id, 10));
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
    <div className="product-page">
      <div className="product-images">
        <img src={product.image} alt={product.name} className="main-image" />
        <img src={product.image} alt={product.name} className="secondary-image" />
        <img src={product.image} alt={product.name} className="secondary-image" />
        <img src={product.image} alt={product.name} className="secondary-image" />
      </div>
      <div className="product-details">
        <h1>{product.name}</h1>
        <h2>{product.brandid}</h2>
        <p className="price">₹ {product.listprice}</p>
        <p className="color">Color: {product.color}</p>
        <p className="description">{product.description}</p>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductPage;