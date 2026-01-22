"use client";

import { Button, Flex } from "antd";
import { useRouter } from "next/navigation";

export function HomeButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/search");
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
      <Button type="primary" size="large" onClick={handleClick}>
        Encuentra tu próximo alojamiento
      </Button>
    </Flex>
  );
}