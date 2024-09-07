import React from 'react';
import { useParams } from 'react-router-dom';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import './ProductPage.css';

interface ProductPageProps {
  // You might want to fetch the product data based on the ID
}

const ProductPage: React.FC<ProductPageProps> = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch product data based on the ID
  // For now, let's use dummy data
  const product = {
    name: 'Sample Product',
    brandid: 'Sample Brand',
    price: 1000,
    description: 'This is a sample product description.',
    img1: 'path/to/image1.jpg',
    img2: 'path/to/image2.jpg',
    img3: 'path/to/image3.jpg',
  };

  return (
    <div className="product-page">
      <div className="product-image">
        <ImageSlider img1={product.img1} img2={product.img2} img3={product.img3} />
      </div>
      <div className="product-details">
        <h2>{product.brandid}</h2>
        <h1>{product.name}</h1>
        <p className="price">₹ {product.price}</p>
        <p className="description">{product.description}</p>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductPage;