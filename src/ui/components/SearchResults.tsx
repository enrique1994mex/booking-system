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
          key={result.accommodation.id}
          title={result.accommodation.name}
        >
          <Space orientation="vertical" style={{ width: '100%' }}>
            {result.rooms.map((room) => (
              <Card
                key={room.id}
                size="small"
                type="inner"
              >
                <Space
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Text strong>{room.accommodationId}</Text>
                  <Text>${room.pricePerNight} / night</Text>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      ))}
    </Space>
  );
}