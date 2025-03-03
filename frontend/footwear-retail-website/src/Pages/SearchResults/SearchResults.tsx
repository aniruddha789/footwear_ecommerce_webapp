import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllProducts } from '../../services/api';
import ProductGrid from '../../containers/ProductGrid/ProductGrid';
import { Product } from '../../types/Product';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(0, 100); // Fetch all products or implement pagination
        const filteredProducts = response.content.filter(product =>
          product.name.toLowerCase().includes(query?.toLowerCase() || '')
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Search Results for: {query}</h2>
      <ProductGrid products={products} parentBreadcrumb="Search Results" />
    </div>
  );
};

export default SearchResults; 