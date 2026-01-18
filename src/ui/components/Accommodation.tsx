"use client";

import { Alert, Card, Empty, Flex, Typography } from "antd";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";
const { Paragraph, Title, Text } = Typography;

export function Accommodation () {
  const { data, error } = useAppSelector(
    (state) => state.accommodation
  );

  if (error) {
    return <Alert type="error" title={error} />;
  }

  if (!data) return <Empty description="No rooms available" />;

  return (
    <Flex gap="large" justify="center" align="center" style={{ width: '100%' }}>
      <Card
          key={data.id}
          style={{ width: 600 }}
          cover={
            <Image
              draggable={false}
              width={600}
              height={400}
              alt={data.name}
              src={data.imageUrl}
            />
          }
        >
          <Title level={4}>{data.name}</Title>
          <Text>{data.location.city}, {data.location.country}</Text>
          <Paragraph>{data.description}</Paragraph> 
        </Card>
    </Flex>
  );
}