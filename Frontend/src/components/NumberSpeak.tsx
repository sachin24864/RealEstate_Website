import React from 'react';
import { useNavigate } from "react-router-dom";

interface StatItem {
  value: string;
  label: string;
}

const statsRow1: StatItem[] = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '25 Million', label: 'sq.ft. Area Sold' },
  { value: '200+', label: 'Skilled Professionals' },
  { value: '500+', label: 'Channel Partners' },
];

const statsRow2: StatItem[] = [
  { value: '10,000+', label: 'Transactions' },
  { value: '4 Lac+ sq.ft.', label: 'Leasing Space' },
  { value: '100+', label: 'Projects Onboard' },
];

interface StatStripProps {
  data: StatItem[];
}

const StatStrip: React.FC<StatStripProps> = ({ data }) => (
  <div className="bg-gray-900 rounded-xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
    {data.map((item, index) => (
      <div
        key={index}
        className="text-center transform transition duration-300 hover:-translate-y-1"
      >
        <p className="text-xl font-bold text-white">{item.value}</p>
        <p className="text-sm text-gray-400">{item.label}</p>
      </div>
    ))}
  </div>
);

const NumberSpeak: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-800 text-white px-10 py-20 relative">
      <div className="max-w-7xl mx-auto space-y-12">

        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">
            <span className="border-b-4 border-cyan-700 pb-1">Number</span>Speak
          </h2>
          <img
            src="/assets/gallery/logo/logo_4.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
            onClick={() => navigate("/login")}
          />
        </div>
        <StatStrip data={statsRow1} />
        <StatStrip data={statsRow2} />
      </div>
    </section>
  );
};

export default NumberSpeak;
