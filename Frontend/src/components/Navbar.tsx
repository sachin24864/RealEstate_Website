import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const Navigate = useNavigate();
  const location = useLocation();

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

  const getLinkClass = (path: string) => {
    return location.pathname === path ? "text-cyan-400" : "hover:text-gray-300 transition";
  };

  const propertyPaths = ["/filter", "/Residential", "/Commercial", "/Industrial", "/Farm House", "/Agricultural Land"];
  const currentPath = decodeURIComponent(location.pathname);
  const isPropertyRoute = propertyPaths.includes(currentPath);

  const getDropdownLinkClass = (path: string) => {
    return currentPath === path
      ? "block px-4 py-2 bg-gray-700 text-cyan-400" 
      : "block px-4 py-2 hover:bg-gray-700"; 
  };

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
            onClick={() => window.location.href=('/')}

          />
          <span className="text-white font-bold text-xl">
            Naveen Associates
          </span>
        </div>

        <nav className="hidden md:flex relative gap-10 text-white font-medium mr-6">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/about-us" className={getLinkClass("/about-us")}>About Us</Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className={`focus:outline-none flex items-center gap-1 transition ${isPropertyRoute ? "text-cyan-400" : "hover:text-gray-300"
                }`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              Properties ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg border border-gray-700">
                <Link
                  to="/Residential"
                  className={getDropdownLinkClass("/Residential")}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Residential
                </Link>
                <Link
                  to="/Commercial"
                  className={getDropdownLinkClass("/Commercial")}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Commercial
                </Link>
                <Link
                  to="/Industrial"
                  className={getDropdownLinkClass("/Industrial")}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Industrial
                </Link>
                 <Link
                  to="/Farm House"
                  className={getDropdownLinkClass("/Farm House")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Farm House
                </Link>
                <Link
                  to="/Agricultural Land"
                  className={getDropdownLinkClass("/Agricultural Land")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Agricultural Land
                </Link>
              </div>
            )}
          </div>

          <Link to="/gallery" className={getLinkClass("/gallery")}>Gallery</Link>
          <Link to="/blogs" className={getLinkClass("/blogs")}>Blogs</Link>
          <Link to="/contact" className={getLinkClass("/contact")}>Contact Us</Link>
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
          <Link to="/" className={`block ${getLinkClass("/")}`} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about-us" className={`block ${getLinkClass("/about-us")}`} onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className={`focus:outline-none flex items-center gap-1 transition w-full text-left ${isPropertyRoute ? "text-cyan-400" : "hover:text-gray-300"
                }`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Properties ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg border border-gray-700">
                <Link
                  to="/Residential"
                  className={getDropdownLinkClass("/Residential")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Residential
                </Link>
                <Link
                  to="/Commercial"
                  className={getDropdownLinkClass("/Commercial")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Commercial
                </Link>
                <Link
                  to="/Industrial"
                  className={getDropdownLinkClass("/Industrial")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Industrial
                </Link>
                <Link
                  to="/Farm House"
                  className={getDropdownLinkClass("/Farm House")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Farm House
                </Link>
                <Link
                  to="/Agricultural Land"
                  className={getDropdownLinkClass("/Agricultural Land")}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Agricultural Land
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/gallery"
            className={`block ${getLinkClass("/gallery")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/blogs"
            className={`block ${getLinkClass("/blogs")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className={`block ${getLinkClass("/contact")}`}
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