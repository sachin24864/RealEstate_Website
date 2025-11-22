import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu toggle

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? "bg-black shadow-md" : "bg-transparent"
        }`}
    >
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/gallery/logo/logo_4.png"
            alt="Logo"
            className="h-10"
          />
          <span className="text-white font-bold text-xl">
            Naveen Associates
          </span>
        </div>

        <nav className="hidden md:flex relative gap-10 text-white font-medium mr-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/about-us" className="hover:text-gray-300 transition">
            About Us
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className="focus:outline-none flex items-center gap-1 hover:text-gray-300"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              Properties ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg border border-gray-700">
                <Link
                  to="/filter?type=Residential"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Residential
                </Link>
                <Link
                  to="/filter?type=Commercial"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Commercial
                </Link>
                <Link
                  to="/filter?type=Industrial"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Industrial
                </Link>
              </div>
            )}
          </div>

          <Link to="/projects" className="hover:text-gray-300 transition">
            Gallery
          </Link>
          <Link to="/blogs" className="hover:text-gray-300 transition">
            Blogs
          </Link>
          <Link to="/contact" className="hover:text-gray-300 transition">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 space-y-3 border-t border-gray-700">
          <Link to="/" className="block hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about-us" className="block hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className="focus:outline-none flex items-center gap-1 hover:text-cyan-400 transition"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Properties ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg border border-gray-700">
                <Link
                  to="/filter?type=Residential"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Residential
                </Link>
                <Link
                  to="/filter?type=Commercial"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Commercial
                </Link>
                <Link
                  to="/filter?type=Industrial"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Industrial
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/projects"
            className="block hover:text-gray-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/blogs"
            className="block hover:text-gray-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className="block hover:text-gray-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
