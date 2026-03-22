import "./PaginatedProductGrid.css"
import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import ProductGrid from '../ProductGrid/ProductGrid';
import { getAllProducts, getProductsByType } from '../../services/api';
import { Product } from '../../types/Product';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';

interface PaginatedProductGridProps {}


const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const pageSize = 8;

  const fetchProducts = useCallback(async (resetPage = false) => {

   
    if (isLoading) return;
    setIsLoading(true);
   
    const currentPage = resetPage ? 0 : page;
   
    try {
      let response ;
      if (category) {
        response = await getProductsByType(category, currentPage, pageSize);
      } else {
        response = await getAllProducts(currentPage, pageSize);
      }

      const items = response?.content;
      if (!items || items.length === 0) {
        setHasMore(false);
        if (resetPage) {
          setProducts([]);
        }
      } else {
        setProducts((prev) =>
          resetPage ? items : [...prev, ...items],
        );
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Show Coming Soon empty state instead of an error banner (browse/refresh flows).
      setHasMore(false);
      setProducts([]);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  }, [category, isLoading, pageSize]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setInitialLoading(true);
    fetchProducts(true);
    // Intentionally only re-run when category (URL segment) changes, not when fetchProducts identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (initialLoading) {
    return <div> </div>;
  }

  return (
    <Container>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={<h4>Loading ...</h4>}
        endMessage={<p></p>}
      >
        <div className="fade-in">
          <ProductGrid products={products} parentBreadcrumb={category || ''} />
        </div>
      </InfiniteScroll>
    </Container>
  );
};

export default PaginatedProductGrid;