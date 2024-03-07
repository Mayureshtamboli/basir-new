import React, { useState, useEffect } from "react";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Define different sets of images and links for mobile and desktop
    const mobileImages = ["https://agarolifestyle.com/cdn/shop/files/OTG_540_x_550_3eceb16f-196c-4d82-a65c-d90c37113798_506x.progressive.jpg?v=1707814550", "https://agarolifestyle.com/cdn/shop/files/OTG_540_x_550_3eceb16f-196c-4d82-a65c-d90c37113798_506x.progressive.jpg?v=1707814550", "https://agarolifestyle.com/cdn/shop/files/OTG_540_x_550_3eceb16f-196c-4d82-a65c-d90c37113798_506x.progressive.jpg?v=1707814550"];
    const desktopImages = ["https://agarolifestyle.com/cdn/shop/files/Supreme_Cordless_Stick_Vacuum_Cleaner_1440_x_550_2544x.progressive.jpg?v=1700137104", "https://agarolifestyle.com/cdn/shop/files/Supreme_Cordless_Stick_Vacuum_Cleaner_1440_x_550_2544x.progressive.jpg?v=1700137104", "https://agarolifestyle.com/cdn/shop/files/Supreme_Cordless_Stick_Vacuum_Cleaner_1440_x_550_2544x.progressive.jpg?v=1700137104"];
    
    const mobileLinks = ["https://agarolifestyle.com/collections/vacuum-cleaner", "https://agarolifestyle.com/collections/vacuum-cleaner", "https://agarolifestyle.com/collections/vacuum-cleaner"];
    const desktopLinks = ["https://example.com/desktop-link1", "https://example.com/desktop-link2", "https://example.com/desktop-link3"];

    // Check if the device is mobile or desktop
    const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

    // Set images and links based on device type
    setImages(isMobile ? mobileImages : desktopImages);
    setLinks(isMobile ? mobileLinks : desktopLinks);

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % (isMobile ? mobileImages.length : desktopImages.length));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const showSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
  };

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <div className={`slide ${index === currentSlide ? 'active' : ''}`} key={index}>
          <a href={links[index]}>
            <img src={image} alt={`Image ${index + 1}`} />
          </a>
        </div>
      ))}
      {/* Optional: Navigation buttons */}
      <div className="slider-nav">
        <button onClick={prevSlide}>‹</button>
        <button onClick={nextSlide}>›</button>
      </div>
    </div>
  );
};

export default Slider;
