import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MobileSearchOverlay.css';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      onClose();
      setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-search-overlay">
      <div className="mobile-search-container" ref={containerRef}>
        <Form onSubmit={handleSearchSubmit} className="mobile-search-form">
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder="Search on Urban Kicks"
            className="mobile-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form>
        <button className="mobile-search-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MobileSearchOverlay; 