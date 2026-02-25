"use client";

import { Flex, Skeleton } from "antd";

export function AccommodationSkeleton() {
  return (
    <Flex vertical gap="large" style={{ width: "100%" }}>
      {/* Header row: title + location */}
      <Flex justify="space-between" align="flex-start">
        <Flex vertical gap="small" style={{ flex: 1 }}>
          <Skeleton.Input active size="large" style={{ width: 320 }} />
          <Skeleton.Input active size="small" style={{ width: 200 }} />
        </Flex>
        <Skeleton.Input active size="default" style={{ width: 120 }} />
      </Flex>

      {/* Large image */}
      <Skeleton.Image
        active
        style={{ width: "100%", height: 420, borderRadius: 8 }}
      />

      {/* Description panel */}
      <Flex gap="large">
        <Flex vertical gap="small" style={{ flex: 2 }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Flex>
        <Flex vertical gap="small" style={{ flex: 1 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Flex>
      </Flex>

      {/* Rooms table */}
      <Skeleton active paragraph={{ rows: 5 }} />
    </Flex>
  );
}
