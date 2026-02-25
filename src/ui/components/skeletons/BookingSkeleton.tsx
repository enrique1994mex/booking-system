"use client";

import { Card, Divider, Flex, Skeleton } from "antd";

export function BookingSkeleton() {
  return (
    <Flex
      vertical
      gap="middle"
      justify="center"
      align="center"
      style={{ width: "100%", padding: "24px 0" }}
    >
      <Card
        style={{ width: 500, borderRadius: 8 }}
        styles={{
          header: {
            backgroundColor: "#003580",
            borderRadius: "8px 8px 0 0",
          },
        }}
        title={<Skeleton.Input active size="small" style={{ width: 160 }} />}
      >
        {/* Accommodation info */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Skeleton.Input active size="default" style={{ width: 220 }} />
          <Skeleton.Input active size="small" style={{ width: 160 }} />
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Room info */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Stay dates */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Skeleton.Input active size="small" style={{ width: 80 }} />
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Price summary */}
        <Flex vertical gap="small">
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </Flex>

        {/* Button */}
        <Skeleton.Button
          active
          block
          size="large"
          style={{ marginTop: 24, height: 48 }}
        />
      </Card>
    </Flex>
  );
}
