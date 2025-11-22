import React from 'react';

interface TestimonialType {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: TestimonialType[] = [
  {
    name: 'Ananya Mehta',
    role: 'Homebuyer, Gurgaon',
    quote:
      'The team was incredibly professional and helped me find the perfect home. Their attention to detail and transparency made the entire process seamless.',
    image: '/assets/gallery/test/test.jpg',
  },
  {
    name: 'Rohit Sharma',
    role: 'Investor, Delhi NCR',
    quote:
      'I was impressed by the quality of projects and the level of service. Highly recommended for anyone looking to invest in real estate.',
    image: '/assets/gallery/test/test_4.jpg',
  },
  {
    name: 'Priya Verma',
    role: 'Commercial Client',
    quote:
      'From site visits to final paperwork, everything was handled with care and precision. Truly a premium experience.',
    image: '/assets/gallery/test/test_2.jpg',
  },
];

const Testimonial: React.FC = () => {
  return (
    <section className="px-6 py-16 bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-cyan-700">CLIENT</span>{' '}
          <span className="text-black">TESTIMONIALS</span>
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Hear what our clients have to say about their experience with us. We take pride in delivering excellence and building lasting relationships.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-2xl transition duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-contain"
                />
                <div>
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
