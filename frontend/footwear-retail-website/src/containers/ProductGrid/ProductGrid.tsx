import React from 'react';
import './ProductGrid.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types/Product';

interface ProductGridProps {
  products: Product[];
  parentBreadcrumb: string;
  /** When search/filter returns nothing (vs empty API catalog). */
  emptyVariant?: 'comingSoon' | 'noSearchResults';
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  parentBreadcrumb,
  emptyVariant = 'comingSoon',
}) => {
  if (!products || products.length === 0) {
    if (emptyVariant === 'noSearchResults') {
      return (
        <div className="product-grid-empty" role="status">
          <h2 className="product-grid-empty__title">No matching products</h2>
          <p className="product-grid-empty__subtitle">Try a different search term.</p>
        </div>
      );
    }
    return (
      <div className="product-grid-empty" role="status">
        <h2 className="product-grid-empty__title">Coming Soon</h2>
        <p className="product-grid-empty__subtitle">Stay tuned — we&apos;re adding new products soon.</p>
      </div>
    );
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
