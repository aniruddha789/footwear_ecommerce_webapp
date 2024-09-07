import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types/Product';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (!products) {
    return <div>No products found.</div>;
  }

  return (
    <div className="productGrid">
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-6">
              <ProductCard
                name={product.name}
                desc={product.description}
                brandid={product.brandid}
                price={product.listprice}
                img1={product.image}
                img2={product.image}
                img3={product.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  
export default ProductGrid;
