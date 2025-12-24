import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const propertyTypes = ["Residential", "Commercial", "Industrial"];
  const subTypeOptions = ["Plot", "Flat", "Apartment", "SCO Plots", "Space", "Land"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getLinkClass = (path: string) =>
    location.pathname === path ? "text-cyan-400" : "hover:text-gray-300 transition";

  return (
    <header className={`fixed top-0 w-full z-50 ${scrolled ? "bg-black shadow-md" : "bg-transparent"}`}>
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
          <img src="/assets/gallery/logo/logo_4.png" alt="Logo" className="h-10" />
          <span className="text-white font-bold text-xl">Naveen Associates</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-white font-medium mr-6">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/about-us" className={getLinkClass("/about-us")}>About Us</Link>

          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => { setIsDropdownOpen(false); setActiveSubMenu(null); }}
          >
            <Link to="/filter" className="flex items-center gap-1 hover:text-cyan-400 transition">
              Properties ▾
            </Link>

            {isDropdownOpen && (
              <div className="absolute left-0 w-56 bg-gray-900 text-white border border-gray-700 rounded shadow-xl">
                {propertyTypes.map((type) => (
                  <div key={type} className="relative" onMouseEnter={() => setActiveSubMenu(type)}>
                    <Link
                      to={`/${encodeURIComponent(type)}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span>{type}</span>
                      <ChevronRight size={14} />
                    </Link>

                    {activeSubMenu === type && (
                      <div className="absolute left-full top-0 w-40 bg-gray-900 border border-gray-700">
                        {subTypeOptions.map((sub) => (
                          <Link
                            key={sub}
                            to={`/filter?type=${encodeURIComponent(type)}&subType=${encodeURIComponent(sub)}`}
                            className="block px-4 py-2 hover:bg-cyan-600 transition"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link to="/Farm_House" className="block px-4 py-3 hover:bg-gray-800 border-t border-gray-800">Farm House</Link>
                <Link to="/Agricultural_Land" className="block px-4 py-3 hover:bg-gray-800">Agricultural Land</Link>
              </div>
            )}
          </div>

          <Link to="/gallery" className={getLinkClass("/gallery")}>Gallery</Link>
          <Link to="/blogs" className={getLinkClass("/blogs")}>Blogs</Link>
          <Link to="/contact" className={getLinkClass("/contact")}>Contact Us</Link>
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;