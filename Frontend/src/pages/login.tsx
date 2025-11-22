import React, { useState, ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import { AxiosError } from "axios";
import { mainClient } from "../store";
import { useAuth } from "../store/app-store/AuthContext";

const { Title, Text } = Typography;
const { Password } = Input;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   *  Handle Login
   */
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      message.warning("Please enter both email and password!");
      return;
    }

    try {
      setLoading(true);

      const response = await mainClient.request("POST", "/login", {
        data: { email, password },
        withCredentials: true,
      });

      // Update the global auth state
      login(response.data.user);

      message.success("Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid credentials!";
        return message.error(String(msg));
      }

      if (err instanceof Error) {
        return message.error(String(err.message));
      }

      message.error("Something went wrong during login!");
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, login]);

  /**
   *  Handle Forgot Password
   */
  const handleForgotPassword = useCallback(async () => {
    if (!email) {
      message.warning("Please enter your email first!");
      return;
    }

    try {
      setLoading(true);

      const response = await mainClient.request("POST", "/forgot-password", {
        data: { email },
        withCredentials: true,
      });

      message.success(
        response.data?.message || "Password sent to your email!"
      );
      console.log("Forgot password response:", response.data);
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.message ||
          "Failed to send password reset email!";
        return message.error(msg);
      }

      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleHomeClick = () => navigate("/");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 px-4">
      <div className="bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-md border-gray-700">
        <Title level={2} className="text-center !text-black !mb-2">
          Admin Login
        </Title>
        <Text className="block text-center !text-black mb-6">
          Log in to your account
        </Text>

        <Form layout="vertical" requiredMark={false} onFinish={handleLogin}>
          <Form.Item
            label={<span className="text-black">Email</span>}
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="rounded-md border-gray-700 text-black placeholder-gray-500 focus:border-cyan-600 focus:shadow-none"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Password
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="rounded-md border-gray-700 text-black placeholder-gray-500 focus:border-cyan-600 focus:shadow-none"
            />
          </Form.Item>

          {/* Login Button */}
          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="!bg-cyan-700 hover:!bg-cyan-800 !text-white !font-medium rounded-md !h-10"
            >
              Log In
            </Button>
          </Form.Item>

          {/* Forgot Password + Home Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleForgotPassword}
              disabled={loading}
              className="flex-1 !bg-yellow-600 hover:!bg-yellow-700 !text-white !font-medium rounded-md !h-10"
            >
              Forgot Password
            </Button>
            <Button
              onClick={handleHomeClick}
              className="flex-1 !bg-gray-600 hover:!bg-gray-700 !text-white !font-medium rounded-md !h-10"
            >
              Go to Home
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
