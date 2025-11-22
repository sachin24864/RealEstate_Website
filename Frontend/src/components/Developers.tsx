import React from 'react';

const logos: string[] = [
  '/assets/gallery/devlopers/dlf.png',
  '/assets/gallery/devlopers/m3m.webp',
  '/assets/gallery/devlopers/wl.png',
  '/assets/gallery/devlopers/elan.png',
  '/assets/gallery/devlopers/emaar.png',
  '/assets/gallery/devlopers/13.png',
  '/assets/gallery/devlopers/14.png',
  '/assets/gallery/devlopers/15.png',
  '/assets/gallery/devlopers/16.png',
  '/assets/gallery/devlopers/17.png',
  '/assets/gallery/devlopers/19.png',
  '/assets/gallery/devlopers/20.png',
  '/assets/gallery/devlopers/22.png',
  '/assets/gallery/devlopers/23.png',
  '/assets/gallery/devlopers/24.png',
  '/assets/gallery/devlopers/adani.png',
  '/assets/gallery/devlopers/BPTP.png',
  '/assets/gallery/devlopers/silverglades.png',
  '/assets/gallery/devlopers/Omaxe.png',
  '/assets/gallery/devlopers/Zak.png',
];

const Developers: React.FC = () => {
  return (
    <section id="developers" className="px-6 py-16 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-2">A+ DEVELOPERS</h2>
        <p className="text-yellow-500 mb-10">Trusted Partners in Excellence</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 transform transition duration-300 hover:-translate-y-2"
            >
              <img
                src={logo}
                alt={`Developer ${index + 1}`}
                className="w-full h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Developers;
