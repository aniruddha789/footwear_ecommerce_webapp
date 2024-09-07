import React, { useState, useEffect } from 'react';
import { Container, Pagination } from 'react-bootstrap';
import ProductGrid from '../ProductGrid/ProductGrid';
import { getAllProducts, getProductsByType } from '../../services/api';
import { Product } from '../../types/Product';

interface PaginatedProductGridProps {
  productType?: string;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({ productType }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 8; // Number of products per page

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productType]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (productType) {
        response = await getProductsByType(productType, currentPage, pageSize);
      } else {
        response = await getAllProducts(currentPage, pageSize);
      }
      setProducts(response);
      // setTotalPages(response.totalPages);
        console.log('products: ' + products + '\n')
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
};

export default PaginatedProductGrid;