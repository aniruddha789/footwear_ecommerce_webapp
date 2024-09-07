import "./PaginatedProductGrid.css"
import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import ProductGrid from '../ProductGrid/ProductGrid';
import { getAllProducts, getProductsByType } from '../../services/api';
import { Product } from '../../types/Product';
import InfiniteScroll from 'react-infinite-scroll-component';


interface PaginatedProductGridProps {
  productType?: string;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({ productType }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  const fetchProducts = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (productType) {
        console.log("Page: " + page + " Size: " + pageSize);
        response = await getProductsByType(productType, page, pageSize);
      } else {
        response = await getAllProducts(page, pageSize);
      }

      console.log("response length: " + response.length);
      
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setProducts([...products, ...response]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, productType, isLoading, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [productType]);
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more products to load.</p>}
      >
        <div className="fade-in">
          <ProductGrid products={products} />
        </div>
      </InfiniteScroll>
    </Container>
  );
};

export default PaginatedProductGrid;