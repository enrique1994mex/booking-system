"use client";

import { Alert, Card, Empty, Flex, Typography } from "antd";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";
import { RoomsTable } from "./RoomsTable";
import { AccommodationCardVM } from "../models/AccommodationCardVM";

const { Paragraph, Title, Text } = Typography;

type RoomRow = AccommodationCardVM["rooms"][number];

export function Accommodation () {
  const { data, error } = useAppSelector(
    (state) => state.accommodation
  );

  if (error) {
    return <Alert type="error" title={error} />;
  }

  if (!data) return <Empty description="No rooms available" />;

  const handleBook = (room: RoomRow) => {
    console.log("Booking room:", room.id);
  };

  return (
    <Flex vertical gap="large" justify="center" align="center" style={{ width: '100%' }}>
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
      <Card title="Available rooms" style={{ width: 800 }}>
        <RoomsTable
          rooms={data.rooms}
          onBook={handleBook}
        />
      </Card>
    </Flex>
  );
}