import React from 'react';
import PaginatedProductGrid from '../../containers/PaginatedProductGrid/PaginatedProductGrid';

function Shoes() {
  return (
    <div>
      <PaginatedProductGrid productType="shoe" />
    </div>
  );
}   

export default Shoes;