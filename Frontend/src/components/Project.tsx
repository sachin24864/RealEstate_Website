import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { ContactPop } from "./ContactPop";
import { propertyClint } from "../store/index";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ProjectType {
  id: string;
  title: string;
  Price: string;
  Location: string;
  Images: string[];
  Status?: string;
}

const Project: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isContactPopOpen, setIsContactPopOpen] = useState(false);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await propertyClint.getProperties();
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && scrollRef.current) {
        scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <section id="projects" className="px-6 py-16 bg-white text-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
          <div>
            <h2 className="text-3xl font-bold">
              <span className="text-cyan-700">NEWLY LAUNCHED</span>{" "}
              <span className="text-black">PROJECTS</span>
            </h2>
            <p className="mt-2 max-w-xl text-gray-700">
              Our projects are a testament to the sustainable urban evolution
              that creates an exceptional lifestyle for many. As a leading real
              estate developer, we consistently strive to build projects that
              set a new standard for residential & commercial property.
            </p>
          </div>
          <button
            onClick={() => setIsContactPopOpen(true)}
            className="bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold"
          >
            For Query
          </button>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
          >
            <ChevronLeftIcon className="h-8 w-8 text-gray-700" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
          >
            <ChevronRightIcon className="h-8 w-8 text-gray-700" />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory px-10 flex gap-6 w-full hide-scrollbar"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link to={`/property/${project.id}`} key={project.id}>
                  <div
                    className="snap-start min-w-[320px] h-[400px] bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col"
                  >
                    <div className="h-[230px] w-full overflow-hidden">
                      <img
                        src={
                          project.Images?.[0]
                            ? `${BACKEND_URL}${project.Images[0]}`
                            : "/placeholder.jpg"
                        }
                        alt={project.title}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 bg-gray-200"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-700 mb-1">
                          <CurrencyRupeeIcon className="h-4 w-4 text-cyan-700" />
                          <span>{project.Price}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <MapPinIcon className="h-4 w-4 text-cyan-700" />
                          <span>{project.Location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">Loading projects...</p>
            )}
          </div>
        </div>
      </div>

      <ContactPop open={isContactPopOpen} onOpenChange={setIsContactPopOpen} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Project;
