// src/components/CategoryBox.js
import React from 'react';
import PropTypes from 'prop-types';
import './AdminDashboard.css';

const CategoryBox = ({ title, nominations, onNomineeClick }) => {
  return (
    <div className="category-box">
      <h3>{title}</h3>
      {nominations.length > 0 ? (
        <ul>
          {nominations.map((n) => (
            <li key={n.name}>
              <button
                type="button"
                className="nominee-btn"
                onClick={() => onNomineeClick(n.name)}
              >
                {n.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No nominations yet.</p>
      )}
    </div>
  );
};
CategoryBox.propTypes = {
  title: PropTypes.string.isRequired,
  nominations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onNomineeClick: PropTypes.func.isRequired,
};

export default CategoryBox;

