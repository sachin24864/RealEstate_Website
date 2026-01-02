import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layout, Typography, Card, Row, Col, Spin } from 'antd';
import { blogClint } from '@/store';
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";


const { Content } = Layout;
const { Title, Paragraph } = Typography;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BlogItem {
    _id: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
    slug: string;
}

const BlogPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    const setMeta = (name: string, content: string) => {
        let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("name", name);
            document.head.appendChild(el);
        }
        el.content = content;
    };

    const setCanonical = (href: string) => {
        let link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "canonical";
            document.head.appendChild(link);
        }
        link.href = href;
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const data = await blogClint.getBlog();
                setBlogs(data.blogs);

                // Set page-level SEO meta
                document.title = "Blog & News | Real Estate";
                setMeta("description", "Read our latest blog posts about real estate trends, market insights, and tips.");
                setCanonical(`${window.location.origin}/blogs`);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);
    const truncate = (text: string | undefined, n = 150) =>
        !text ? "" : text.length > n ? text.slice(0, n).trimEnd() + "..." : text;

    return (
        <>
            <SEO
                title="Blog & News | Naveen Associates"
                description="Read latest real estate news, property tips and market insights by Naveen Associates."
                url="https://naveenassociatesgroup.com/blogs"
            />
            <Navbar />
            <Layout className="bg-gray-900">
                <div className="relative h-[50vh] flex items-center justify-center text-center text-white">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1950&q=80')" }}>
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                    </div>
                    <div className="relative z-10">
                        <Title level={1} className="!text-white text-4xl md:text-6xl font-bold">Our Blog & News</Title>
                        <Paragraph className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                            Stay updated with the latest trends and insights in the real estate market.
                        </Paragraph>
                    </div>
                </div>

                <Content className="py-16 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="text-center py-16"><Spin size="large" /></div>
                        ) : (
                            <Row gutter={[32, 32]}>
                                {blogs.map((blog) => (
                                    // <Col key={blog._id} xs={24} sm={12} lg={8}>
                                    //     <Card
                                    //         hoverable
                                    //         className="bg-gray-800 border-gray-700 text-white h-full flex flex-col"
                                    //         cover={<img alt={blog.title} src={`${BACKEND_URL}${blog.image}`} className="h-56 w-full object-contain bg-black" />}
                                    //     >
                                    //         <Title level={4} className="!text-white">{blog.title}</Title>
                                    //         <Paragraph className="text-gray-300 flex-grow">{blog.description}</Paragraph>
                                    //         <p className="text-xs text-gray-500 mt-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                    //     </Card>
                                    // </Col>
                                    <Col key={blog.slug} xs={24} sm={12} lg={8}>
                                        <Link to={`/blog/${blog.slug}`} className="block">
                                            <Card
                                                hoverable
                                                className="bg-gray-800 border-gray-700 text-white h-full flex flex-col"
                                                cover={<img alt={blog.title} src={`${BACKEND_URL}${blog.image}`} className="h-56 w-full object-contain bg-black" />}
                                            >
                                                <Title level={4} className="!text-white">{blog.title}</Title>
                                                <Paragraph className="text-gray-300 flex-grow">
                                                    {truncate(blog.description, 150)}
                                                </Paragraph>
                                                <p className="text-xs text-gray-500 mt-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Content>
            </Layout>
            <Footer />
        </>
    );
};

export default BlogPage;