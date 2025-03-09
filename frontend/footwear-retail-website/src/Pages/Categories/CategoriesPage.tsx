import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesPage.css';
import topsImage from '../../assets/tops.jpg'
import bottomsImg from '../../assets/bottoms.jpg'
import shoesImg from '../../assets/shoes9.jpg'
import accImg from '../../assets/accessories.jpg'

const CategoriesPage: React.FC = () => {
  const categories = [
    { name: 'Casual Shirts', path: '/tops', image: topsImage },
    { name: 'Casual Bottoms', path: '/bottoms', image: bottomsImg},
    { name: 'Shoes', path: '/shoe', image: shoesImg },
    { name: 'Accessories', path: '/accessories', image: accImg }
  ];

  return (
    <div className="categories-page">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <Link to={category.path} key={index} className="category-card">
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <div className="category-name">{category.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage; 