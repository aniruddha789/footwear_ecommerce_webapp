import React from 'react';
import { Container, Button, Breadcrumb } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './FilterSortBreadcrumb.css';
import filterIcon from '../../assets/filter.png';
import sortIcon from '../../assets/sort.png';

const FilterSortBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Container className="filter-sort-breadcrumb">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Breadcrumb.Item active key={name}>
              {name}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item href={routeTo} key={name}>
              {name}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <div className="filter-sort-buttons">
        <div className="filter-sort-item">
          <span className="clickable-text">Filter</span>
          <img src={filterIcon} alt="Filter" className="button-icon" />
        </div>
        <div className="filter-sort-item">
          <span className="clickable-text">Sort</span>
          <img src={sortIcon} alt="Sort" className="button-icon" />
        </div>
      </div>
    </Container>
  );
};

export default FilterSortBreadcrumb;