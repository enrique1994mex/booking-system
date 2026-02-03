"use client";

import { useRouter } from "next/navigation";
import { Card, Form, Input, Button, Typography, Alert, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/application/hooks/useAuth";

const { Title, Text, Link } = Typography;

interface LoginPageProps {
  redirectTo: string;
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signIn(values);
      router.push(redirectTo);
    } catch {
      // Error is handled by Redux state
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "24px"
    }}>
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Sign In
        </Title>

        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Text style={{ display: "block", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup">Sign Up</Link>
        </Text>
      </Card>
    </div>
  );
}
