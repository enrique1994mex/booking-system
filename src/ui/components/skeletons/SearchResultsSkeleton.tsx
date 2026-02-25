"use client";

import { Flex, Skeleton } from "antd";

function SearchResultCardSkeleton() {
  return (
    <Flex gap="middle" style={{ width: "100%", marginBottom: 16 }}>
      <Skeleton.Image active style={{ width: 220, height: 160, borderRadius: 8, flexShrink: 0 }} />
      <Flex vertical gap="small" style={{ flex: 1 }}>
        <Skeleton.Input active size="large" style={{ width: "60%" }} />
        <Skeleton.Input active size="small" style={{ width: "40%" }} />
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
        <Skeleton.Input active size="default" style={{ width: 120 }} />
      </Flex>
    </Flex>
  );
}

export function SearchResultsSkeleton() {
  return (
    <Flex vertical style={{ width: "100%" }}>
      <SearchResultCardSkeleton />
      <SearchResultCardSkeleton />
      <SearchResultCardSkeleton />
    </Flex>
  );
}
