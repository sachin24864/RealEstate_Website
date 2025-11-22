import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layout, Typography, Card, Row, Col, Spin } from 'antd';
import { blogClint } from '@/store';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BlogItem {
    _id: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
}

const BlogPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const data = await blogClint.getBlog();
                setBlogs(data.blogs);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <>
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
                                    <Col key={blog._id} xs={24} sm={12} lg={8}>
                                        <Card
                                            hoverable
                                            className="bg-gray-800 border-gray-700 text-white h-full flex flex-col"
                                            cover={<img alt={blog.title} src={`${BACKEND_URL}${blog.image}`} className="h-56 w-full object-contain bg-black" />}
                                        >
                                            <Title level={4} className="!text-white">{blog.title}</Title>
                                            <Paragraph className="text-gray-300 flex-grow">{blog.description}</Paragraph>
                                            <p className="text-xs text-gray-500 mt-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                        </Card>
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