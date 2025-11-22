import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="px-6 py-16 bg-gray-800 h-full text-white">
      <div className="max-w-4xl mx-auto h-full">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p
          className="text-gray-400 line-clamp-3"
        >
          We are redefining real estate with innovation, transparency, and trust.
          Our mission is to connect people with homes that match their dreams.
          With a user-friendly platform and expert guidance, we make buying,
          selling, and renting properties easier than ever.
          We're not just a real estate company—we're a movement toward smarter,
          more transparent living. At FutureHomes, we believe that finding the perfect property should be intuitive, inspiring, and stress-free.
          Our platform blends cutting-edge technology with human insight, offering verified listings,
          immersive virtual tours, and personalized recommendations that adapt to your lifestyle.
          Whether you're buying your first home, investing in commercial space, or exploring new launches,
          we're here to guide you with clarity and confidence. Our team is driven by innovation, backed by data,
          and committed to helping you unlock the future of real estate—one property at a time.
        </p>
        <button
          onClick={() => navigate('/about-us')}
          className="mt-2 px-4 py-2 bg-cyan-700 text-white rounded-md font-semibold hover:underline"
        >
          Read More
        </button>
      </div>
    </section>
  );
};

export default About;
