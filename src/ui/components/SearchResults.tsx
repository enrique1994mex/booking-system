"use client";

import { Card, Alert, Typography, Flex } from "antd";
import { mapSearchResultToCardVM } from "../mappers/mapSearchResultToCardVM";
import { useAppSelector } from "@/application/hooks";
import Image from "next/image";

const { Text, Link } = Typography;
const { Meta } = Card;

export function SearchResults() {
  const { results,  error } = useAppSelector(
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
            <Meta title={<Link href={`/accommodation/${card.id}`} target="_blank">{card.title}</Link>} />
            <Text>{card.location}</Text><br />
            <Text>Price From: {card.priceLabel}</Text>
          </Card>
        )
      })}
    </Flex>
  );
}