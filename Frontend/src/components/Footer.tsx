import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';


const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/${targetId}`);
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-md flex flex-col">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/gallery/logo/logo_4.png" alt="Naveen Associates Logo" className="h-10" />
              <div>
                <h3 className="text-xl font-bold text-white">Naveen Associates</h3>
                <p className="text-sm text-gray-400">Trusted for Transparency</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm mt-8">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-cyan-700" />
                +91 9053188821
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-cyan-700" />
                naveenassociatesgroup@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-cyan-700" />
                DP01 Tricolour Street, Sector 108, Near Westerlies main gate, Gurugram
              </li>
            </ul>
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-700 mt-8">Follow Us</h1>
            <div className="flex gap-8 mt-4 text-white">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="hover:text-cyan-700 cursor-pointer" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="hover:text-cyan-700 cursor-pointer" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-cyan-700 cursor-pointer" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube className="hover:text-cyan-700 cursor-pointer" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-md">
          <h4 className="text-lg font-semibold text-cyan-700 mb-8">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/about-us" className="hover:text-cyan-700 mt-6">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/filter" className="hover:text-cyan-700 mt-6">
                Properties
              </Link>
            </li>
            <li>
              <a href="#developers" onClick={(e) => handleScrollLink(e, '#developers')} className="hover:text-cyan-700 mt-6 cursor-pointer">
                Developers
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cyan-700 mt-6">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-cyan-700 mt-6">
                News & Updates
              </Link>
            </li>
          </ul>
        </div>

        {/* Featured Projects */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-md">
          <h4 className="text-lg font-semibold text-cyan-700 mb-4">
            Featured Projects
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <div className="bg-gray-700 rounded-md p-3">
                <p className="font-semibold text-white">Whiteland The Aspen</p>
                <p className="text-gray-400 text-xs">Sector 76, Gurgaon</p>
              </div>
            </li>
            <li>
              <div className="bg-gray-700 rounded-md p-3">
                <p className="font-semibold text-white">Whiteland Blissville</p>
                <p className="text-gray-400 text-xs">Sector 76, Gurgaon</p>
              </div>
            </li>
            <li>
              <div className="bg-gray-700 rounded-md p-3">
                <p className="font-semibold text-white">DLF The Arbour</p>
                <p className="text-gray-400 text-xs">Premium Location</p>
              </div>
            </li>
          </ul>
          <button className="mt-6 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition"
            onClick={() => navigate('/filter')}
          >
            View All Projects
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Naveen Associates . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
