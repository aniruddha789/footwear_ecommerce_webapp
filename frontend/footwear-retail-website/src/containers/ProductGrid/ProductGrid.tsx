import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types/Product';

interface ProductGridProps {
  products: Product[];
  parentBreadcrumb: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, parentBreadcrumb }) => {
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="productGrid">
      <div className="container">
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={`${product.id}-${index}`} className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard
                  product={product} // Pass the entire product object directly
                  parentBreadcrumb={parentBreadcrumb}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
