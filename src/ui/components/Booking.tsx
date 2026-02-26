"use client";

import { Button, Card, Divider, Empty, Flex, Typography, } from "antd";
import { BookingSkeleton } from "./skeletons/BookingSkeleton";
import { ErrorResult } from "./ErrorResult";
import { CalendarOutlined, CheckCircleOutlined, EnvironmentOutlined, HomeOutlined, TeamOutlined, UserOutlined, } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "@/application/hooks";
import { confirmBooking } from "@/application/slices/bookingSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/application/hooks/useAuth";

const { Title, Text } = Typography;


export function Booking() {
  const { preview, error, status } = useAppSelector((state) => state.booking);
  const { user } = useAuth();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const isConfirming = status === "confirming";
  const isReady = status === "readyToConfirm";
  
  if (error) {
    return <ErrorResult error={error} />;
  }

  if (status === "loadingPreview") {
    return <BookingSkeleton />;
  }

  if (!preview || !isReady) {
    return <Empty description="No booking information available" />;
  }


  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleConfirm = async () => {
  if (!preview || isConfirming) return;

  try {
    const resultAction = await dispatch(
      confirmBooking({
        userId: user?.id || "",
        roomId: preview.roomId,
        from: preview.stay.from,
        to: preview.stay.to,
      })
    );

    if (confirmBooking.fulfilled.match(resultAction)) {
      router.push(`/payment/${resultAction.payload}`);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Flex
      vertical
      gap="middle"
      justify="center"
      align="center"
      style={{ width: "100%", padding: "24px 0" }}
    >
      <Card
        style={{ width: 500, borderRadius: 8 }}
        styles={{
          header: {
            backgroundColor: "#003580",
            color: "#fff",
            borderRadius: "8px 8px 0 0",
          },
        }}
        title={
          <Flex align="center" gap="small">
            <CheckCircleOutlined style={{ color: "#fff", fontSize: 20 }} />
            <Text strong style={{ color: "#fff", fontSize: 18 }}>
              Booking Summary
            </Text>
          </Flex>
        }
      >
        {/* Accommodation Info */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Flex align="center" gap="small">
            <HomeOutlined style={{ color: "#003580", fontSize: 18 }} />
            <Title level={5} style={{ margin: 0 }}>
              {preview.accommodation.name}
            </Title>
          </Flex>
          <Flex align="center" gap="small" style={{ marginLeft: 26 }}>
            <EnvironmentOutlined style={{ color: "#6b6b6b" }} />
            <Text type="secondary">
              {preview.accommodation.city}, {preview.accommodation.country}
            </Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Room Info */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Text strong style={{ color: "#003580" }}>
            Room Details
          </Text>
          <Flex
            justify="space-between"
            align="center"
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px 16px",
              borderRadius: 6,
            }}
          >
            <Flex vertical gap={4}>
              <Text strong>{preview.room.type}</Text>
              <Flex align="center" gap="small">
                <TeamOutlined style={{ color: "#6b6b6b" }} />
                <Text type="secondary">
                  {preview.room.capacity}{" "}
                  {preview.room.capacity === 1 ? "Guest" : "Guests"}
                </Text>
              </Flex>
            </Flex>
            <Text strong style={{ color: "#003580", fontSize: 16 }}>
              {formatCurrency(preview.room.pricePerNight)}
              <Text type="secondary" style={{ fontSize: 12 }}>
                /night
              </Text>
            </Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Stay Dates */}
        <Flex vertical gap="small" style={{ marginBottom: 16 }}>
          <Text strong style={{ color: "#003580" }}>
            Your Stay
          </Text>
          <Flex
            gap="large"
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px 16px",
              borderRadius: 6,
            }}
          >
            <Flex vertical gap={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                CHECK-IN
              </Text>
              <Flex align="center" gap="small">
                <CalendarOutlined style={{ color: "#003580" }} />
                <Text strong>{formatDate(preview.stay.from)}</Text>
              </Flex>
            </Flex>
            <Flex vertical gap={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                CHECK-OUT
              </Text>
              <Flex align="center" gap="small">
                <CalendarOutlined style={{ color: "#003580" }} />
                <Text strong>{formatDate(preview.stay.to)}</Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="center" gap="small" style={{ marginTop: 4 }}>
            <UserOutlined style={{ color: "#6b6b6b" }} />
            <Text type="secondary">
              {preview.stay.nights} {preview.stay.nights === 1 ? "night" : "nights"}
            </Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: "16px 0" }} />

        {/* Price Summary */}
        <Flex vertical gap="small">
          <Text strong style={{ color: "#003580" }}>
            Price Details
          </Text>
          <Flex justify="space-between">
            <Text type="secondary">
              {formatCurrency(preview.room.pricePerNight)} x {preview.stay.nights}{" "}
              {preview.stay.nights === 1 ? "night" : "nights"}
            </Text>
            <Text>{formatCurrency(preview.stay.totalPrice)}</Text>
          </Flex>
          <Divider style={{ margin: "8px 0" }} />
          <Flex
            justify="space-between"
            style={{
              backgroundColor: "#e8f4f8",
              padding: "12px 16px",
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              Total
            </Text>
            <Text strong style={{ fontSize: 20, color: "#003580" }}>
              {formatCurrency(preview.stay.totalPrice)}
            </Text>
          </Flex>
        </Flex>

        {/* Confirm Button */}
        <Button
          type="primary"
          size="large"
          block
          onClick={handleConfirm}
          disabled={isConfirming}
          loading={isConfirming}
          style={{
            marginTop: 24,
            height: 48,
            backgroundColor: "#0071c2",
            fontWeight: 600,
          }}
        >
          Pay now 
        </Button>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 12,
            fontSize: 12,
          }}
        >
          You’ll be redirected to secure payment
        </Text>
      </Card>
    </Flex>
  );
}