import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types/Product';

interface ProductGridProps {
  products: Product[];
  parentBreadcrumb: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products , parentBreadcrumb}) => {

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="productGrid">
      <div className="container">
        <div className="row">
          {products.map((product, index) => (
            <div key={`${product.id}-${index}`} className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3 fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <ProductCard
                id={product.id}
                name={product.name}
                desc={product.description}
                brandid={product.brandid}
                price={product.listprice}
                img1={product.image}
                img2={product.image}
                img3={product.image}
                category={product.type}
                parentBreadcrumb={parentBreadcrumb}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
