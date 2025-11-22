import { useEffect, useState } from "react";
import { propertyClint } from "../store/index";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function PropertyGallery() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        setIsLoading(true);

        // Fetch all property images
        const data = await propertyClint.getallpic();
        console.log("Raw data:", data);

        // Normalize and format data
        const formattedData = data.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.Status,
          images: p.Images || [], 
          type: p.Type?.toLowerCase() || "unknown",
        }));

        console.log("Formatted data:", formattedData);
        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching property images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyImages();
  }, []);

  const filterByType = (type) =>
    properties.filter((p) => p.type === type.toLowerCase());

  const sections = [
    { title: "Residential", key: "Residential" },
    { title: "Commercial", key: "commercial" },
    { title: "Industrial", key: "industrial" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-800 py-20 px-6 sm:px-10 lg:px-20 text-white">
        <h1 className="text-4xl font-bold text-center mb-14">
          Our Property Gallery
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-300 text-lg py-20">
            Loading images...
          </div>
        ) : (
          sections.map((section) => {
            const filtered = filterByType(section.key);
            const allImages = filtered.flatMap((p) => p.images);

            console.log(section.title, allImages);

            return (
              <div key={section.key} className="mb-20">
                <h2 className="text-3xl font-semibold mb-8 border-b-2 border-gray-600 pb-2">
                  {section.title}
                </h2>

                {allImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allImages.map((img, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <img
                          src={`${BACKEND_URL}${img}`}
                          alt={`${section.title} Property`}
                          className="w-full h-56 object-contain bg-gray-900 hover:scale-105 transition-transform duration-500"
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-10">
                    No {section.title.toLowerCase()} properties available.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}
