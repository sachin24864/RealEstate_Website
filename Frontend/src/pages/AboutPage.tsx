import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layout, Typography, Card, Row, Col } from 'antd';
import {
    TeamOutlined,
    BulbOutlined,
    CheckCircleOutlined,
    AimOutlined,
    EyeOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Layout className="bg-gray-900">
                <div
                    className="relative h-[50vh] flex items-center justify-center text-center text-white"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1950&q=80')",
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                    </div>
                    <div className="relative z-10">
                        <Title level={1} className="!text-white text-4xl md:text-6xl font-bold">
                            About Naveen Associates
                        </Title>
                        <Paragraph className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                            Your trusted partner in navigating the real estate landscape with clarity and confidence.
                        </Paragraph>
                    </div>
                </div>

                <Content className="py-16 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <Card className="bg-gray-800 border-gray-700 text-white mb-12 shadow-lg">
                            <Paragraph className="text-lg text-gray-300 leading-relaxed">
                                Naveen Associates is a reputable real estate company based in Gurugram that is dedicated to providing clear, dependable, and customer-focused property solutions. We have years of experience in the fast-paced real estate market in NCR and are experts at helping clients buy, sell, rent, and invest in both residential and business properties.
                            </Paragraph>
                        </Card>

                        <Row gutter={[32, 32]}>
                            <Col xs={24} md={12}>
                                <Card className="bg-gray-800 border-gray-700 text-white h-full shadow-lg">
                                    <Title level={3} className="!text-cyan-500 flex items-center gap-2"><TeamOutlined /> Who We Are</Title>
                                    <Paragraph className="text-gray-300">
                                        At Naveen Associates, real estate is more than just transactions; it focuses on helping people find places where they can grow, succeed, and create lasting value. Our team knows a lot about the market and takes a unique approach to make sure that every client gets expert advice that is just right for them.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card className="bg-gray-800 border-gray-700 text-white h-full shadow-lg">
                                    <Title level={3} className="!text-cyan-500 flex items-center gap-2"><BulbOutlined /> What We Do</Title>
                                    <Paragraph className="text-gray-300">
                                        We offer a diverse array of real estate services, including residential sales, commercial leasing, property management, and luxury solutions. We make the process easier with professionalism and knowledge, whether you are looking for your dream house, a good investment, or a place for your business to run.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card className="bg-gray-800 border-gray-700 text-white h-full shadow-lg">
                                    <Title level={3} className="!text-cyan-500 flex items-center gap-2"><EyeOutlined /> Our Approach</Title>
                                    <Paragraph className="text-gray-300">
                                        Trust, honesty, and openness are the things that hold us together. We focus on knowing what each client wants and giving them clear, useful advice. We make sure everything goes smoothly and safely, from researching the market to helping with legal paperwork.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card className="bg-gray-800 border-gray-700 text-white h-full shadow-lg">
                                    <Title level={3} className="!text-cyan-500 flex items-center gap-2"><CheckCircleOutlined /> Why Pick Us?</Title>
                                    <ul className="space-y-2 text-gray-300 list-disc list-inside">
                                        <li>Strong understanding of the real estate market</li>
                                        <li>Personalized suggestions tailored to your objectives</li>
                                        <li>Advice based on facts and honesty</li>
                                        <li>Full support during the whole deal</li>
                                        <li>An excellent track record for dependability and customer satisfaction</li>
                                    </ul>
                                </Card>
                            </Col>
                        </Row>

                        <Card className="bg-gray-800 border-gray-700 text-white mt-12 text-center shadow-lg">
                            <Title level={2} className="!text-cyan-500 flex items-center justify-center gap-2"><AimOutlined /> Our Mission</Title>
                            <Paragraph className="text-lg text-gray-300 max-w-3xl mx-auto">
                                To give our clients the tools they need to make smart real estate investments and create important spaces by providing them clear information, honest advice, and smooth real estate experiences.
                            </Paragraph>
                        </Card>
                    </div>
                </Content>
            </Layout>
            <Footer />
        </>
    );
};

export default AboutPage;