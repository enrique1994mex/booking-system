"use client";

import { Card, Alert, Typography, Flex } from "antd";
import { mapSearchResultToCardVM } from "../mappers/mapSearchResultToCardVM";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";

const { Link, Title, Paragraph } = Typography;
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
        return (
          <Card
            key={card.id}
            hoverable
            style ={{ width: 300 }}
            cover={
              <Image
                draggable={false}
                width={300}
                height={350}
                alt={result.name}
                src={card.imageUrl}
              />
            }
          >
            <Meta 
              title={<Link href={`/accommodation/${card.id}?from=${criteria?.startDate}&to=${criteria?.endDate}`} 
              target="_blank"
              >
                <Title level={4}>{card.title}</Title>
              </Link>} 
            />
            <Link 
              href={`/accommodation/${card.id}?from=${criteria?.startDate}&to=${criteria?.endDate}`} 
              target="_blank"
              underline
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