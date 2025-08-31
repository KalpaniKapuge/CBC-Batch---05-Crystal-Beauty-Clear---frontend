import { useState } from "react";

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
        <img
          src={images[currentIndex] || "https://via.placeholder.com/400"}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
              &rarr;
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="w-full flex justify-center items-center mt-4 gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-16 h-16 md:w-20 md:h-20 m-1 rounded-lg object-cover cursor-pointer border-2 transition-all duration-300 ${
                index === currentIndex ? "border-pink-600" : "border-transparent hover:border-pink-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}