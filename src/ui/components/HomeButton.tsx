"use client";

import { Button, Flex, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export function HomeButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/search");
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        minHeight: "70vh",
        background: "linear-gradient(135deg, #003b95 0%, #0057d9 100%)",
        borderRadius: 12,
        padding: "64px 24px",
        margin: 24,
        textAlign: "center",
      }}
    >
      <Title
        level={1}
        style={{ color: "#fff", margin: 0, fontSize: 42, fontWeight: 700 }}
      >
        Find your next stay
      </Title>
      <Paragraph
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 18,
          marginTop: 12,
          marginBottom: 40,
          maxWidth: 480,
        }}
      >
        Search deals on hotels, homes, and much more...
      </Paragraph>
      <Button
        type="default"
        size="large"
        icon={<SearchOutlined />}
        onClick={handleClick}
        style={{
          height: 52,
          fontSize: 16,
          fontWeight: 600,
          paddingInline: 36,
          borderRadius: 8,
        }}
      >
        Explore accommodations
      </Button>
    </Flex>
  );
}
