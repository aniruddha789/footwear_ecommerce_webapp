import React from 'react';
import "./ContactUs.css"
import { useBrand } from '../../context/BrandContext';

const ContactUs: React.FC = () => {
  const brand = useBrand();
  return (
    <div>
      <h1>Contact Us</h1>
      <div className="phone">
        <h2>Cell: {brand.phoneContactLine}</h2>
      </div>
      <div className="address">

      <h2> 
        Address: {brand.addressLine}

      </h2>

      </div>
     
    </div>
  );
};

export default ContactUs;
