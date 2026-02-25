"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Card, Flex, Result, Skeleton } from "antd";

export function BookingSuccessSkeleton() {
  return (
    <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
      <Card style={{ width: 540, borderRadius: 8 }}>
        <Result
          icon={<LoadingOutlined spin style={{ fontSize: 64, color: "#0071c2" }} />}
          title={<Skeleton.Input active size="large" style={{ width: 240 }} />}
          subTitle={<Skeleton.Input active size="small" style={{ width: 180 }} />}
          extra={
            <Flex vertical gap="small" align="center">
              <Skeleton active paragraph={{ rows: 3 }} title={false} style={{ width: 340 }} />
              <Skeleton.Button active size="large" style={{ width: 160, height: 40 }} />
            </Flex>
          }
        />
      </Card>
    </Flex>
  );
}
