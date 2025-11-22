import React from 'react';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const Choose: React.FC = () => {
  const features: Feature[] = [
    { icon: '🏠', title: 'Smart Homes', desc: 'Tech-enabled living spaces.' },
    { icon: '🔒', title: 'Secure Deals', desc: 'Verified documentation.' },
    { icon: '📍', title: 'Prime Locations', desc: 'Top-rated areas.' },
    { icon: '💬', title: 'Expert Advice', desc: 'Real estate specialists.' },
    { icon: '⚡', title: 'Fast Process', desc: 'Quick approvals.' },
    { icon: '🤝', title: 'Trusted Partners', desc: 'Reliable collaborations.' },
  ];

  return (
    <section className="px-6 py-16 bg-gray-800 text-cyan-700">
      <h2 className="text-3xl font-bold text-center mb-10 text-white">Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg hover:scale-105 transition-transform duration-300 text-center"
          >
            <div className="text-3xl mb-2 flex justify-center">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Choose;
