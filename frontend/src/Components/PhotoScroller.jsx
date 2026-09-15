import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotoScroller = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg",
      alt: "Doctor consulting with patient",
      caption: "Professional healthcare consultation",
    },

    {
      id: 3,
      url: "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg",
      alt: "Medical team performing surgery",
      caption: "Expert surgical procedures by skilled professionals",
    },

    {
      id: 5,
      url: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
      alt: "Pharmacist explaining medication",
      caption: "Personalized medicine consultation",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Healthcare Facilities
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Take a visual tour of our modern facilities and expert healthcare
            professionals dedicated to your wellbeing.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-lg aspect-[16/9] max-h-[600px]">
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].alt}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xl font-semibold">
                  {photos[currentIndex].caption}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoScroller;
