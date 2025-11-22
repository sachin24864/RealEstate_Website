import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [status, setStatus] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [city, setCity] = useState<string>("");
  const [manualCity, setManualCity] = useState<string>("");

  const navigate = useNavigate();

  const toggle = (group: "status" | "type", value: string) => {
    const setter = group === "status" ? setStatus : setType;
    const current = group === "status" ? status : type;
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const resetFilters = () => {
    setStatus([]);
    setType([]);
    setCity("");
    setManualCity("");
  };

  const handleSearch = () => {
    const searchCity = manualCity || city;
    const params = new URLSearchParams();

    if (searchCity) params.append("city", searchCity);
    if (status.length > 0) params.append("status", status.join(","));
    if (type.length > 0) params.append("type", type.join(","));

    navigate(`/filter?${params.toString()}`);
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/gallery/bg/bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-base sm:text-lg md:text-2xl mb-6">
          Explore futuristic living spaces tailored for you
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-4 w-full px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-4/5 md:w-3/4 lg:w-2/3 max-w-3xl bg-white/20 backdrop-blur-md rounded-lg p-2 gap-2">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white text-black text-sm rounded-md outline-none cursor-pointer"
            >
              <option value="">All Locations</option>
              <option value="delhi">Delhi</option>
              <option value="gurgaon">Gurgaon</option>
              <option value="noida">Noida</option>
              <option value="faridabad">Faridabad</option>
            </select>

            <input
              type="text"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Enter location"
              className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-300 border-none outline-none w-full sm:w-auto"
            />

            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-5 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-2 bg-white text-cyan-700 rounded-md font-semibold mt-4 flex items-center gap-2 hover:bg-gray-200 transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
          </svg>
          Filters
        </button>

        {showFilters && (
          <div className="mt-4 text-left text-white bg-white/20 backdrop-blur-md w-100 rounded-lg p-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium mb-2">PROPERTY STATUS</p>
                {["Ready_to_Move", "Under_Construction", "New_Launch"].map(
                  (option) => (
                    <label key={option} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={status.includes(option)}
                        onChange={() => toggle("status", option)}
                        className="accent-white"
                      />
                      <span>{option.replace(/_/g, " ")}</span>
                    </label>
                  )
                )}
              </div>
              <div className="ml-10">
                <p className="font-medium mb-2">PROJECT TYPE</p>
                {["Residential", "Commercial", "Industrial"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 mb-1 hover:cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={type.includes(option)}
                      onChange={() => toggle("type", option)}
                      className="accent-white"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-1 bg-white text-black rounded-md font-semibold flex items-center gap-2 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5.75.75 0 0 1 1.5 0 9 9 0 1 1-9-9 .75.75 0 0 1 0 1.5Zm0 3a.75.75 0 0 1 .75.75v3.69l2.22 2.22a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8.25A.75.75 0 0 1 12 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Reset
              </button>

              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-cyan-700 text-white rounded-md font-semibold hover:cursor-pointer hover:bg-cyan-600"
              >
                Search Properties
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
