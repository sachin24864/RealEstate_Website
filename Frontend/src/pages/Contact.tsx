import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  message as antdMessage,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mainClient } from "../store/index";


const { Title, Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await mainClient.request("POST", "/api/user/contact", { data: values });
      antdMessage.success("Message sent successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      antdMessage.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Layout style={{ background: "#fff" }}>
        <div
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1950&q=80') center/cover no-repeat",
            color: "#fff",
            padding: "170px 0",
            textAlign: "center",
          }}
        >
          <Title level={1} style={{ color: "#fff", margin: 0 }}>
            Contact Us
          </Title>
          <Text style={{ fontSize: 18, color: "#e0e0e0" }}>
            We’d love to hear from you. Get in touch with us!
          </Text>
        </div>

        {/* Contact Info Section */}
        <Content style={{
          background: "linear-gradient(to bottom right, #0f172a, #334155, #64748b)",
          padding: "60px 80px 30px"
        }}>
          <Row gutter={[32, 32]} justify="center">
            {[
              {
                icon: <PhoneOutlined />,
                title: "Phone",
                text: "9053188821",
              },
              {
                icon: <MailOutlined />,
                title: "Email",
                text: "naveenassociatesgroup@gmail.com",
              },
              {
                icon: <GlobalOutlined />,
                title: "Website",
                text: "www.eliteproinfra.com",
                link: "https://www.eliteproinfra.com",
              },
              {
                icon: <EnvironmentOutlined />,
                title: "Office",
                text: `DP01 Tricolour Street, Sector 108, Near Westerlies main gate, Gurugram`,
              },
            ].map((item, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  bordered={false}
                  style={{
                    textAlign: "center",
                    height: 230,
                    borderRadius: 12,
                    boxShadow: "0 6px 20px rgba(0,0,0,10)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: 40, color: "#334155", marginBottom: 10 }}>
                    {item.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {item.title}
                  </Title>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.text}
                    </a>
                  ) : (
                    <Text>{item.text}</Text>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Content>


        {/* Contact Form */}
        <div
          style={{
            background:
              "linear-gradient(to bottom right, #0f172a, #334155, #64748b)",
            padding: "80px 20px",
            color: "white",
          }}
        >
          <Row gutter={[48, 32]} align="middle" style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Map Column */}
            <Col xs={24} lg={10}>
              <a href="https://www.google.com/maps/search/?api=1&query=Westerlies+Main+Gate,+Experion+Heartsong+Tower+4,+Experion+Heartsong,+Sector+108,+Gurugram,+Haryana+122006,+India" target="_blank" rel="noopener noreferrer">
                <iframe
                  src="https://maps.google.com/maps?q=Westerlies%20Main%20Gate%2C%20Experion%20Heartsong%20Tower%204%2C%20Experion%20Heartsong%2C%20Sector%20108%2C%20Gurugram%2C%20Haryana%20122006%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="550"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </a>
            </Col>

            {/* Form Column */}
            <Col xs={24} lg={14}>
              <div
                style={{
                  background: "white",
                  padding: "40px 30px",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <Title level={2} style={{ textAlign: "center", marginBottom: 10, color: "#0f172a" }}>
                  Let’s Connect
                </Title>
                <Text style={{ display: "block", textAlign: "center", marginBottom: 30, color: "#555" }}>
                  Have a question or want to schedule a visit? Fill out the form and we’ll get back to you shortly.
                </Text>

                <Form layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Full Name" name="FullName" rules={[{ required: true, message: "Please enter your name" }]}>
                        <Input placeholder="Enter your full name" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Email Address" name="Email" rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email" }]}>
                        <Input placeholder="Enter your email" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Phone Number" name="Phone_number" rules={[{ required: true, message: "Please enter your phone number" }]}>
                        <Input placeholder="Enter your phone number" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Subject" name="Subject">
                        <Input placeholder="Enter subject" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label="Your Message" name="messsage" rules={[{ required: true, message: "Please enter your message" }]}>
                        <TextArea rows={4} placeholder="Write your message..." />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{
                          width: "100%",
                          backgroundColor: "#0e7490",
                          borderColor: "#0e7490",
                          height: 45,
                          fontSize: 16,
                        }}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default ContactPage;
