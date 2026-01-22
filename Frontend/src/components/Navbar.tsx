import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  // --- NEW MOBILE STATES ---
  const [mobilePropsExpanded, setMobilePropsExpanded] = useState(false);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const propertyData: Record<string, string[]> = {
    Residential: ["Plot", "Floor", "Apartment", "Villa"],
    Commercial: ["SCO Plots", "Space"],
    Industrial: ["Land"],
  };

  const propertyTypes = Object.keys(propertyData);

  // Function to close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobilePropsExpanded(false);
    setMobileSubExpanded(null);
  };

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

        {/* --- DESKTOP NAVIGATION (Unchanged) --- */}
        <nav className="hidden md:flex items-center gap-10 text-white font-medium mr-6">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/about-us" className={getLinkClass("/about-us")}>About Us</Link>

          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => { setIsDropdownOpen(false); setActiveSubMenu(null); }}
          >
            <Link to="/properties" className="flex items-center gap-1 hover:text-cyan-400 transition">
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
                      <div className="absolute left-full top-0 w-48 bg-gray-900 border border-gray-700 shadow-2xl">
                        {propertyData[type].map((sub) => (
                          <Link
                            key={sub}
                            to={`/properties?type=${encodeURIComponent(type)}&subType=${encodeURIComponent(sub)}`}
                            className="block px-4 py-2 hover:bg-cyan-600 transition text-sm"
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

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button className="md:hidden text-white z-[100]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- NEW MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-black text-white transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 md:hidden z-[90] overflow-y-auto`}>
        <div className="flex flex-col pt-24 px-6 space-y-4 text-lg">
          <Link to="/" onClick={closeMobileMenu} className="border-b border-gray-800 pb-3">Home</Link>
          <Link to="/about-us" onClick={closeMobileMenu} className="border-b border-gray-800 pb-3">About Us</Link>

          {/* Properties Mobile Wrapper */}
          <div className="flex flex-col border-b border-gray-800 pb-3">
            <div className="flex justify-between items-center">
              {/* Click text to go to page */}
              <Link to="/properties" onClick={closeMobileMenu} className="flex-1">Properties</Link>
              {/* Click arrow to expand */}
              <button onClick={() => setMobilePropsExpanded(!mobilePropsExpanded)} className="p-2">
                <ChevronDown className={`transition-transform ${mobilePropsExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>

            {mobilePropsExpanded && (
              <div className="pl-4 mt-3 space-y-4">
                {propertyTypes.map((type) => (
                  <div key={type} className="flex flex-col">
                    <div className="flex justify-between items-center text-gray-300">
                      <Link to={`/${type}`} onClick={closeMobileMenu} className="flex-1 py-1">{type}</Link>
                      <button onClick={() => setMobileSubExpanded(mobileSubExpanded === type ? null : type)} className="p-1">
                        <ChevronRight className={`transition-transform ${mobileSubExpanded === type ? "rotate-90" : ""}`} />
                      </button>
                    </div>

                    {mobileSubExpanded === type && (
                      <div className="pl-4 mt-2 flex flex-col space-y-3 border-l border-gray-700">
                        {propertyData[type].map((sub) => (
                          <Link 
                            key={sub} 
                            to={`/properties?type=${type}&subType=${sub}`} 
                            onClick={closeMobileMenu}
                            className="text-gray-400 text-base"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link to="/Farm_House" onClick={closeMobileMenu} className="text-gray-300">Farm House</Link>
                <Link to="/Agricultural_Land" onClick={closeMobileMenu} className="text-gray-300 pb-2">Agricultural Land</Link>
              </div>
            )}
          </div>

          <Link to="/gallery" onClick={closeMobileMenu} className="border-b border-gray-800 pb-3">Gallery</Link>
          <Link to="/blogs" onClick={closeMobileMenu} className="border-b border-gray-800 pb-3">Blogs</Link>
          <Link to="/contact" onClick={closeMobileMenu} className="border-b border-gray-800 pb-3">Contact Us</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;  