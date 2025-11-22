import React from "react";

const Promises: React.FC = () => {
  const promises: string[] = [
    "Transparent Pricing",
    "Verified Listings",
    "24/7 Support",
    "Smart Recommendations",
  ];

  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-16 underline decoration-cyan-500 underline-offset-4">
          Our Promises
        </h2>

        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 relative">
          {promises.map((text, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-lg px-6 py-4 w-full sm:w-[260px] md:w-[280px] lg:w-[250px] xl:w-[260px] shadow-lg relative transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="bg-cyan-700 text-white font-bold w-10 h-10 flex items-center justify-center rounded-md mr-4 flex-shrink-0">
                {index + 1}
              </div>

              <p className="text-cyan-700 font-medium text-sm sm:text-base">
                {text}
              </p>

              {index !== promises.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-16 border-t-2 border-cyan-700 transform -translate-y-1/2 translate-x-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promises;
