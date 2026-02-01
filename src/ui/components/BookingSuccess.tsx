import { Button, Card, Flex, Result, Typography } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { BookingResultVM } from "../models/BookingResultVM";

const { Text, Title } = Typography;

type Props = {
  booking: BookingResultVM;
  onBackHome: () => void;
};

export function BookingSuccess({ booking, onBackHome }: Props) {
  
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

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
          subTitle={`Reservation ID: ${booking.bookingId}`}
        />

        <Flex vertical gap="middle">
          {/* Accommodation */}
          <Flex vertical>
            <Title level={5} style={{ marginBottom: 0 }}>
              {booking.accommodation.name}
            </Title>

            <Flex align="center" gap="small">
              <EnvironmentOutlined />
              <Text type="secondary">
                {booking.accommodation.city}, {booking.accommodation.country}
              </Text>
            </Flex>
          </Flex>

          {/* Stay dates */}
          <Flex align="center" gap="small">
            <CalendarOutlined />
            <Text>
              {formatDate(booking.stay.from)} → {formatDate(booking.stay.to)} (
              {booking.stay.nights} nights)
            </Text>
          </Flex>

          {/* Room info */}
          <Flex align="center" gap="small">
            <HomeOutlined />
            <Text>
              {booking.room.type} · {booking.room.capacity} guests
            </Text>
          </Flex>

          {/* Price */}
          <Flex align="center" gap="small">
            <DollarOutlined />
            <Text strong>
              {formatCurrency(booking.stay.totalPrice, booking.stay.currency)}
            </Text>
          </Flex>

          {/* Actions */}
          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 16 }}
            onClick={onBackHome}
          >
            Back to Home
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}