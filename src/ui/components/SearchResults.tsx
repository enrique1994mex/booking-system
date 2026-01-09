"use client";

import { Card, List, Spin, Alert, Typography } from "antd";
import { useAppSelector } from "@/application/hooks";

const { Title, Text } = Typography;

export function SearchResults() {
  const { results, loading, error } = useAppSelector(
    (state) => state.search
  );

  if (loading) {
    return (
      <Spin tip="Searching available rooms...">
        <div style={{ minHeight: 200 }} />
      </Spin>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      {results.map((result) => (
        <Card
          key={result.accommodation.id}
          title={result.accommodation.name}
          style={{ marginBottom: 16 }}
        >
          <List
            dataSource={result.rooms}
            renderItem={(room) => (
              <List.Item>
                <Title>{room.accommodationId}</Title>
                <Text style={{ marginLeft: 8 }}>
                  ${room.pricePerNight} / night
                </Text>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </div>
  );
}