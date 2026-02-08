"use client";

import { Flex, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Loading() {
  return (
    <Flex
      justify="center"
      align="center"
      vertical
      gap={16}
      style={{ minHeight: "60vh" }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      <Text type="secondary" style={{ fontSize: 15 }}>
        Redirecting to secure payment…
      </Text>
    </Flex>
  );
}
