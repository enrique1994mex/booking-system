"use client";

import { Card, Alert, Typography, Flex } from "antd";
import { mapSearchResultToCardVM } from "../mappers/mapSearchResultToCardVM";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";
import Link from "next/link";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

export function SearchResults() {
  const { results,  error, criteria } = useAppSelector(
    (state) => state.search
  );

  if (error) {
    return <Alert type="error" title={error} />;
  }

  return (
    <Flex gap="large" style={{ width: '100%' }}>
      {results.map((result) => {
        const card = mapSearchResultToCardVM(result);
        const url = `/accommodation/${card.id}?from=${criteria?.startDate}&to=${criteria?.endDate}`;
        return (
          <Card
            key={card.id}
            hoverable
            style ={{ width: 300 }}
            cover={
              <Link href={url} target="_blank">
                <Image
                  draggable={false}
                  width={300}
                  height={350}
                  alt={result.name}
                  src={card.imageUrl}
                />
              </Link>
            }
          >
            <Meta 
              title={<Link href={url} 
              target="_blank"
              >
                <Title level={4}>{card.title}</Title>
              </Link>} 
            />
            <Link 
              href={url} 
              target="_blank"
            >
              {card.location}
            </Link>
            <Paragraph>Price From: {card.priceLabel}</Paragraph>
          </Card>
        )
      })}
    </Flex>
  );
}