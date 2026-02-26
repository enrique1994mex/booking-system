"use client";

import { Empty, Flex, Typography, Badge, Tag, Divider } from "antd";
import { ErrorResult } from "./ErrorResult";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { RoomsTable } from "./RoomsTable";
import { AccommodationCardVM } from "../models/AccommodationCardVM";
import { generateRating, getRatingLabel } from "../mappers/generateRating";
import { useMemo } from "react";

const { Paragraph, Title, Text } = Typography;

type RoomRow = AccommodationCardVM["rooms"][number];

function RatingBadge({
  score,
  label,
  reviews,
}: {
  score: string;
  label: string;
  reviews: string;
}) {
  return (
    <Flex align="center" gap={8}>
      <Flex vertical align="flex-end" style={{ textAlign: "right" }}>
        <Text strong style={{ fontSize: 14 }}>
          {label}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {reviews}
        </Text>
      </Flex>
      <Badge
        count={score}
        style={{
          backgroundColor: "#003b95",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: "8px 8px 8px 0",
          padding: "4px 8px",
          height: 36,
          minWidth: 36,
          lineHeight: "28px",
        }}
      />
    </Flex>
  );
}

export function Accommodation() {
  const { data, error } = useAppSelector((state) => state.accommodation);
  const router = useRouter();
  const params = useSearchParams();

  const rating = useMemo(() => {
    if (!data) return null;
    const { score, reviews } = generateRating(data.id);
    return {
      score: score.toFixed(1),
      label: getRatingLabel(score),
      reviews: `${reviews} reviews`,
    };
  }, [data]);

  if (error) {
    return <ErrorResult error={error} />;
  }

  if (!data) return <Empty description="No rooms available" />;

  const handleBook = (room: RoomRow) => {
    router.push(
      `/booking?roomId=${room.id}&from=${params.get("from")}&to=${params.get("to")}`
    );
  };

  const lowestPrice = Math.min(...data.rooms.map((r) => r.pricePerNight));

  return (
    <Flex
      vertical
      gap={24}
      style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}
    >
      {/* Header */}
      <div>
        <Flex justify="space-between" align="flex-start">
          <div>
            <Flex align="center" gap={8} wrap="wrap">
              <Title level={2} style={{ margin: 0, color: "#003b95" }}>
                {data.name}
              </Title>
              <Tag color="blue">Hotel</Tag>
            </Flex>
            <Flex align="center" gap={4} style={{ marginTop: 6 }}>
              <EnvironmentOutlined
                style={{ color: "#1677ff", fontSize: 14 }}
              />
              <Text style={{ fontSize: 14 }}>
                {data.location.city}, {data.location.country}
              </Text>
              <Text
                style={{ fontSize: 14, color: "#1677ff", cursor: "pointer" }}
              >
                &middot; Show on map
              </Text>
            </Flex>
          </div>
          {rating && (
            <RatingBadge
              score={rating.score}
              label={rating.label}
              reviews={rating.reviews}
            />
          )}
        </Flex>
      </div>

      {/* Image */}
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <Image
          draggable={false}
          width={960}
          height={480}
          alt={data.name}
          src={data.imageUrl}
          style={{ objectFit: "cover", width: "100%", height: "auto" }}
          priority
        />
      </div>

      {/* Description + Price summary */}
      <Flex
        gap={24}
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 24,
          background: "#fff",
        }}
      >
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginTop: 0 }}>
            About this property
          </Title>
          <Paragraph
            style={{ fontSize: 14, color: "#333", marginBottom: 0 }}
          >
            {data.description}
          </Paragraph>
        </div>
        <Divider orientation="vertical" style={{ height: "auto" }} />
        <Flex
          vertical
          align="flex-end"
          justify="center"
          style={{ minWidth: 180, textAlign: "right" }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            Prices from
          </Text>
          <Text strong style={{ fontSize: 26, color: "#003b95" }}>
            $ {lowestPrice.toFixed(2)}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            per night
          </Text>
        </Flex>
      </Flex>

      {/* Rooms table */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Available rooms
          </Title>
        </div>
        <div style={{ padding: "0 8px" }}>
          <RoomsTable rooms={data.rooms} onBook={handleBook} />
        </div>
      </div>
    </Flex>
  );
}
