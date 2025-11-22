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


const Index = () => {
  return (
    <>
     <Navbar/>
            <Hero />
            <About />
            <Promises />
            <Choose />
            <Project/>
            <NumberSpeak/>
            <Developers/>
             <Blog />
            <Testimonial/>
            <Footer/>
       </>
  );
};

export default Index;
