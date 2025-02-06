import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProductGallery = ({ images = [], mainImage, productName }) => {
  // If no additional images provided, use main image only
  const allImages = images.length > 0 ? [mainImage, ...images] : [mainImage];
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="aspect-square w-full bg-base-200 rounded-lg overflow-hidden">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail Navigation - Only show if there are multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square w-20 rounded-lg overflow-hidden 
                ${selectedImage === image ? 'ring-2 ring-primary' : 'opacity-70'}`}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  mainImage: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired
};

export default ProductGallery;
