import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { propertyClint } from "@/store";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Property {
  id: string;
  title: string;
  Location: string;
  Type: string;
  Status: string;
  Images: string[];
}

const FilterProperties: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const city = params.get("city");
  const status = params.get("status");
  const type = params.get("type");

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setIsLoading(true);
        const data = await propertyClint.getFilteredProperties({ city, status, type });
        setProperties(data);
      } catch (error) {
        console.error("Error fetching filtered properties:", error);
        toast.error("Failed to load properties for the selected filters.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [city, status, type]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Showing Properties
          </h1>
          <p className="text-center text-gray-300 mb-10">
            City: <span className="font-semibold">{city || "All"}</span> | Status:{" "}
            <span className="font-semibold">{status?.replace(/_/g, " ") || "Any"}</span> | Type:{" "}
            <span className="font-semibold">{type || "All"}</span>
          </p>

          {isLoading ? (
            <div className="text-center text-gray-400 mt-20 text-lg">Loading properties...</div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {properties.map((property) => (
                <Link to={`/property/${property.id}`} key={property.id}>
                  <div
                    className="bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full flex flex-col hover:scale-105 transform transition duration-300"
                  >
                    <img
                      src={`${BACKEND_URL}${property.Images[0]}`}
                      alt={property.title}
                      className="w-full h-48 object-contain bg-gray-900"
                    />
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {property.Location.toUpperCase()} • {property.Type}
                      </p>
                      <span className="mt-auto pt-2 inline-block text-sm font-medium text-cyan-400">
                        {property.Status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-20 text-lg">
              No properties found for your filters.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FilterProperties;
