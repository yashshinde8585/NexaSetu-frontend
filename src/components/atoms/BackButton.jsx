import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

// Back navigation button.
const BackButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center transition-colors outline-none cursor-pointer ${className}`}
    >
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-none bg-black border border-white/20 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary transition-all">
        <ArrowLeft size={16} />
      </div>
    </button>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default BackButton;
