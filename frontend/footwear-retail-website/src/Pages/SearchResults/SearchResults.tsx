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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(0, 100); // Fetch all products or implement pagination
        const filteredProducts = response.content.filter(product =>
          product.name.toLowerCase().includes(query?.toLowerCase() || '')
        );
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Search Results for: {query}</h2>
      <ProductGrid
        products={products}
        parentBreadcrumb="Search Results"
        emptyVariant="noSearchResults"
      />
    </div>
  );
};

export default SearchResults; 