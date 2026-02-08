"use client";

import { Button, Flex, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "60vh", padding: 24 }}
    >
      <Flex
        vertical
        align="center"
        gap={16}
        style={{
          width: "100%",
          maxWidth: 480,
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          background: "#fff",
          padding: "48px 32px",
          textAlign: "center",
        }}
      >
        <CloseCircleOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
        <Title level={3} style={{ margin: 0 }}>
          Payment error
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {error.message}
        </Text>
        <Button
          type="primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: 8 }}
        >
          Try again
        </Button>
      </Flex>
    </Flex>
  );
}
