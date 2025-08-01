import { useState } from "react";

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="w-full h-[500px] overflow-hidden rounded">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full flex justify-center items-center mt-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`w-[70px] h-[70px] m-1 rounded-2xl object-cover cursor-pointer border-2 transition ${
              index === currentIndex
                ? "border-pink-600"
                : "border-transparent hover:border-pink-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}