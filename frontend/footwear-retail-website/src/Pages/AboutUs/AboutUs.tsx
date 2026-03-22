import React from 'react';
import "./AboutUs.css"
import { useBrand } from '../../context/BrandContext';

const AboutUs: React.FC = () => {
  const brand = useBrand();
  return (
    <div>
      <h1>About Us</h1>
      <div className="description">

      <h2>{brand.aboutLead}</h2>
      </div>
      
    </div>
  );
};

export default AboutUs;
