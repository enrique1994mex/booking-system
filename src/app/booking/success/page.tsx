"use client";

import { Alert, Button, Card, Flex, Result, Typography } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/application/hooks";
import { clearBooking } from "@/application/slices/bookingSlice";

const { Text, Title } = Typography;

export default function BookingSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { result } = useAppSelector((state) => state.booking);

  if (!result) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
        <Alert
          title="Booking not found"
          description="No booking confirmation data available."
          type="error"
          showIcon
        />
      </Flex>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const handleBackHome = () => {
    dispatch(clearBooking());
    router.replace("/");
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "80vh", padding: 24 }}
    >
      <Card style={{ width: 540, borderRadius: 12 }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Booking Confirmed!"
          subTitle={`Reservation ID: ${result.bookingId}`}
        />

        <Flex vertical gap="middle">
          {/* Accommodation */}
          <Flex vertical>
            <Title level={5} style={{ marginBottom: 0 }}>
              {result.accommodation.name}
            </Title>

            <Flex align="center" gap="small">
              <EnvironmentOutlined />
              <Text type="secondary">
                {result.accommodation.city}, {result.accommodation.country}
              </Text>
            </Flex>
          </Flex>

          {/* Stay dates */}
          <Flex align="center" gap="small">
            <CalendarOutlined />
            <Text>
              {formatDate(result.stay.from)} → {formatDate(result.stay.to)} (
              {result.stay.nights} nights)
            </Text>
          </Flex>

          {/* Room info */}
          <Flex align="center" gap="small">
            <HomeOutlined />
            <Text>
              {result.room.type} · {result.room.capacity} guests
            </Text>
          </Flex>

          {/* Price */}
          <Flex align="center" gap="small">
            <DollarOutlined />
            <Text strong>
              {formatCurrency(result.stay.totalPrice, result.stay.currency)}
            </Text>
          </Flex>

          {/* Actions */}
          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 16 }}
            onClick={handleBackHome}
          >
            Back to Home
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
