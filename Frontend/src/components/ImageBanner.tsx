import React, { useEffect, useState } from "react";
import { galleryClient } from "@/store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface GalleryImage {
  _id: string;
  image: string;
  createdAt: string;
}

const DUMMY_IMAGE = "/assets/gallery/bg/banner.png";

const ImageBanner: React.FC = () => {
  const [bannerImage, setBannerImage] = useState<string>(DUMMY_IMAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await galleryClient.getImages("Home Banner");
        const images: GalleryImage[] = response.images || [];

        if (images.length > 0 && images[0].image) {
          setBannerImage(`${BACKEND_URL}${images[0].image}`);
        } else {
          setBannerImage(DUMMY_IMAGE);
        }
      } catch (error) {
        console.error("Banner fetch failed:", error);
        setBannerImage(DUMMY_IMAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) return null;

  return (
    <section className="w-full">
      <img
        src={bannerImage}
        alt="Home Banner"
        className="w-full h-[30vh] md:h-[45vh] object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = DUMMY_IMAGE;
        }}
      />
    </section>
  );
};

export default ImageBanner;
