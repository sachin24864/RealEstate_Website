import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ContactPop } from '@/components/ContactPop';
import Footer from '@/components/Footer';

// --- Ant Design Imports ---
import {
    Layout,
    Row,
    Col,
    Breadcrumb,
    Carousel,
    Image,
    Typography,
    Rate,
    Card,
    Button,
    Spin,
    Alert,
    Space
} from 'antd';
import {
    EnvironmentOutlined,
    AreaChartOutlined,
    HomeOutlined
} from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';
import { propertyClint } from '@/store';
// --- Destructure Antd Components for cleaner code ---
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 1. Define a TypeScript interface for your data
interface Property {
    id: string;
    title: string;
    Location: string;
    Price: number;
    Type: string;
    Beds: number;
    Baths: number;
    area_sqft: number;
    Status: string;
    Images: string[];
    createdAt: string;
}

// 3. The Main Page Component
const PropertyPage: React.FC = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    // Ref to control the main image carousel
    const carouselRef = useRef<CarouselRef>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setError('Property ID not found in URL.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await propertyClint.getPropertyById(id);
                setProperty(data);
            } catch (err) {
                setError('Failed to fetch property data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // Thumbnail click handler
    const handleThumbnailClick = (index: number) => {
        carouselRef.current?.goTo(index);
    };

    // 4. Handle Loading state with antd Spin
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading Property..." />
            </div>
        );
    }

    // 5. Handle Error state with antd Alert
    if (error || !property) {
        return (
            <div className="p-8">
                <Alert
                    message="Error"
                    description={error || 'Property not found.'}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // 6. Render the attractive page layout
    return (
        <>
            <Navbar />
            <Layout className="bg-gray-800 pt-20">
                <Content className="p-4 md:p-8 max-w-7xl mx-auto w-full">

                    <Row gutter={[32, 48]}>
                        {/* --- Left Column: Image Gallery --- */}
                        <Col xs={24} lg={15}>
                            <Card className="bg-gray-900 border-gray-700">
                                {/* Main Image Carousel */}
                                <Carousel ref={carouselRef} dots={false}>
                                    {property.Images.map((img, index) => (
                                        <div key={index}>
                                            <Image
                                                width="100%"
                                                src={`${BACKEND_URL}${img}`}
                                                alt={`${property.title} view ${index + 1}`}
                                                className="rounded-lg"
                                                preview={false}
                                            />
                                        </div>
                                    ))}
                                </Carousel>

                                {/* Thumbnail Strip */}
                                <Space size="small" className="mt-4 flex flex-wrap">
                                    {property.Images.map((img, index) => (
                                        <Image
                                            key={`${BACKEND_URL}${img}-${index}`}
                                            src={`${BACKEND_URL}${img}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={100}
                                            height={70}
                                            preview={false}
                                            onClick={() => handleThumbnailClick(index)}
                                            className="cursor-pointer rounded-md object-contain bg-gray-900"
                                        />
                                    ))}
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} lg={9}>
                            <div className="flex flex-col space-y-4">
                                <Title level={1} className="!mb-0 !text-white">{property.title}</Title>

                                <Text type="secondary" className="text-lg !text-gray-400">
                                    <EnvironmentOutlined className="mr-2" />
                                    {property.Location}
                                </Text>

                                <Text className="text-3xl font-bold !text-white">
                                    ₹ {property.Price} <span className="text-lg font-normal">Onwards</span>
                                </Text>

                                {/* <div className="flex items-center space-x-2">
                                <Rate disabled defaultValue={0} count={5} />
                                <Text className="text-red-500">5 ratings</Text>
                            </div> */}

                                <Text className="text-base !text-gray-300">
                                    Status: <strong className="!text-white">{property.Status.replace('_', ' ')}</strong>
                                </Text>

                                <Card size="small" className="bg-gray-700 border-gray-600">
                                    <div className="flex items-center space-x-4">
                                        <AreaChartOutlined className="text-3xl text-custom-gold" />
                                        <div>
                                            <Text type="secondary" className="block">Project Size</Text>
                                            <Text strong className="text-base">{property.area_sqft} Sq. Ft.</Text>
                                        </div>
                                    </div>
                                </Card>

                                <Card size="small" className="bg-gray-700 border-gray-600">
                                    <div className="flex items-center space-x-4">
                                        <HomeOutlined className="text-3xl text-custom-gold" />
                                        <div>
                                            <Text type="secondary" className="block">Properties for Sale</Text>
                                            <Text strong className="text-base">in {property.title}</Text>
                                        </div>
                                    </div>
                                </Card>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    className="bg-custom-gold hover:!bg-custom-gold-hover text-white font-bold text-lg h-12"
                                    onClick={() => setIsContactOpen(true)}
                                >
                                    Request a Call Back
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-12">
                        <Col span={24}>
                            <Card title={<Title level={3} className="!text-white">About {property.title}</Title>} className="bg-gray-900 border-gray-700">
                                <Paragraph className="!text-gray-300">
                                    Welcome to {property.title}, a premier {property.Type} development
                                    located in the heart of {property.Location}. This project offers a
                                    luxurious living experience with modern amenities and spacious units.
                                </Paragraph>
                                <Paragraph className="!text-gray-300">
                                    This property is currently {property.Status.replace('_', ' ')} and
                                    features units with {property.Beds} beds and {property.Baths} baths.
                                    Explore a new standard of living with us, starting from just {property.area_sqft} Sq. Ft.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <Footer />
            <ContactPop
                open={isContactOpen}
                onOpenChange={setIsContactOpen}
                initialSubject={`Inquiry about: ${property.title}`}
            />
        </>
    );
};

export default PropertyPage;