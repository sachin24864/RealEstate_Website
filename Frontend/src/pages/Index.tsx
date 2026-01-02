import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Blog from '../components/Blog';
import About from './About'
import Promises from '../components/Promises'
import Choose from './Choose'
import Project from '../components/Project';
import Testimonial from '../components/Testimonial';
import Contact from './Contact';
import Footer from '../components/Footer';
import NumberSpeak from '../components/NumberSpeak';
import Developers from '../components/Developers';
import SEO from "../components/SEO";
import ImageBanner from '@/components/ImageBanner';



const Index = () => {
  return (
    <>
      <SEO
        title="Naveen Associates | Best Property Dealer in Gurugram"
        description="Naveen Associates is a renowned name in real estate in gurugram. We deal in different types of property in gurugram like commercial, residential, industrial etc."
        url="https://naveenassociatesgroup.com/"
      />
      <Navbar />
      <Hero />
      <About />
      <ImageBanner/>
      <Promises />
      <Choose />
      <Project />
      <NumberSpeak />
      <Developers />
      <Blog />
      <Testimonial />
      <Footer />
    </>
  );
};

export default Index;
