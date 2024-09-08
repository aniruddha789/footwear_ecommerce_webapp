import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './FilterSortBreadcrumb.css';

const FilterSortBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="filter-sort-breadcrumb">
      <div className="breadcrumb">
        {pathnames.length > 0 && (
          <>
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </>
        )}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <React.Fragment key={name}>
              {index > 0 && <span className="breadcrumb-separator"> &gt; </span>}
              <Link 
                to={routeTo}
                className={`breadcrumb-item ${isLast ? 'current' : ''}`}
              >
                {name}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default FilterSortBreadcrumb;