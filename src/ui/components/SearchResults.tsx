"use client";

import { Card, Alert, Typography, Space } from "antd";
import { useAppSelector } from "@/application/hooks";

const { Text } = Typography;

export function SearchResults() {
  const { results,  error } = useAppSelector(
    (state) => state.search
  );

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {results.map((result) => (
        <Card
          key={result.id}
          title={result.name}
        >
          <Text>Location: {result.location}</Text><br />
          <Text>Price From: ${result.priceFrom.toFixed(2)} per night</Text>
        </Card>
      ))}
    </Space>
  );
}