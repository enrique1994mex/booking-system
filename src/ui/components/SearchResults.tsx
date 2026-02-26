"use client";

import { Typography, Tag, Button, Flex, Badge } from "antd";
import { ErrorResult } from "./ErrorResult";
import { EnvironmentOutlined } from "@ant-design/icons";
import { mapSearchResultToCardVM } from "../mappers/mapSearchResultToCardVM";
import { AccommodationSearchCardVM } from "../models/AccommodationSearchCardVM";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";
import Link from "next/link";

const { Title, Text } = Typography;

function RatingBadge({ card }: { card: AccommodationSearchCardVM }) {
  return (
    <Flex align="center" gap={8}>
      <Flex vertical align="flex-end" style={{ textAlign: "right" }}>
        <Text strong style={{ fontSize: 13 }}>
          {card.ratingLabel}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {card.reviewCount}
        </Text>
      </Flex>
      <Badge
        count={card.ratingScore}
        style={{
          backgroundColor: "#003b95",
          fontSize: 14,
          fontWeight: 700,
          borderRadius: "8px 8px 8px 0",
          padding: "2px 6px",
          height: 32,
          minWidth: 32,
          lineHeight: "28px",
        }}
      />
    </Flex>
  );
}

function SearchResultCard({
  card,
  url,
}: {
  card: AccommodationSearchCardVM;
  url: string;
}) {
  return (
    <Flex
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
        transition: "box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Link href={url} target="_blank" style={{ flexShrink: 0 }}>
        <Image
          draggable={false}
          width={220}
          height={220}
          alt={card.title}
          src={card.imageUrl}
          style={{ objectFit: "cover", display: "block", height: "100%" }}
        />
      </Link>

      <Flex
        vertical
        justify="space-between"
        style={{ flex: 1, padding: "16px 16px 16px 20px", minWidth: 0 }}
      >
        <Flex justify="space-between" align="flex-start">
          <div style={{ minWidth: 0, flex: 1 }}>
            <Flex align="center" gap={8} wrap="wrap">
              <Link href={url} target="_blank">
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    color: "#003b95",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.title}
                </Title>
              </Link>
              <Tag color="blue" style={{ margin: 0 }}>
                {card.propertyType}
              </Tag>
            </Flex>

            <Flex align="center" gap={4} style={{ marginTop: 4 }}>
              <EnvironmentOutlined
                style={{ color: "#1677ff", fontSize: 13 }}
              />
              <Text style={{ fontSize: 13 }}>{card.location}</Text>
              <Text
                style={{ fontSize: 13, color: "#1677ff", cursor: "pointer" }}
              >
                &middot; {card.locationLink}
              </Text>
            </Flex>
          </div>

          <RatingBadge card={card} />
        </Flex>

        <Flex justify="flex-end" align="flex-end" gap={4}>
          <Flex
            vertical
            align="flex-end"
            style={{ textAlign: "right" }}
          >
            <Text strong style={{ fontSize: 22 }}>
              {card.priceLabel}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {card.priceSubtext}
            </Text>
            <Link href={url} target="_blank" style={{ marginTop: 8 }}>
              <Button type="primary">See availability</Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export function SearchResults() {
  const { results, error, criteria } = useAppSelector(
    (state) => state.search
  );

  if (error) {
    return <ErrorResult error={error} />;
  }

  return (
    <Flex vertical gap={16} style={{ width: "100%" }}>
      {results.map((result) => {
        const card = mapSearchResultToCardVM(result);
        const url = `/accommodation/${card.id}?from=${criteria?.startDate}&to=${criteria?.endDate}`;
        return <SearchResultCard key={card.id} card={card} url={url} />;
      })}
    </Flex>
  );
}
