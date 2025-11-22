import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
const { Title, Paragraph } = Typography;
import { blogClint } from "../store/index";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BlogItem {
    _id: string;
    title: string;
    description: string;
    image: string;
}

const Blog: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [blogItems, setBlogItems] = useState<BlogItem[]>([]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -344, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 344, behavior: 'smooth' });
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await blogClint.getBlog();
                setBlogItems(data.blogs);
            } catch (error) {
                console.error("Failed to fetch blog data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-gray-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Title level={2} className="text-3xl font-bold text-center !text-white mb-12">
                    Blog and News
                </Title>
                <div className="relative">
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 z-10 -ml-4"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 z-10 -mr-4"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 py-4 hide-scrollbar">
                        {blogItems.map((item) => (
                            <div key={item._id} className="snap-start flex-shrink-0 w-[320px]">
                                <Card
                                    hoverable
                                    className="bg-gray-700 border-gray-600 text-white h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2"
                                    cover={<img alt={item.title} src={`${BACKEND_URL}${item.image}`} className="h-48 w-full object-contain bg-black" />}
                                >
                                    <div className="flex flex-col flex-grow">
                                        <Title level={4} className="text-lg font-semibold mb-2 !text-white">
                                            {item.title}
                                        </Title>
                                        <Paragraph className="text-gray-300 flex-grow">{item.description}</Paragraph>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;