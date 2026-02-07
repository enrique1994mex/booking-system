"use client";

import { Button, Table, Tag } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { AccommodationCardVM } from "../models/AccommodationCardVM";

type RoomRow = AccommodationCardVM["rooms"][number];

interface RoomsTableProps {
  rooms: RoomRow[];
  onBook: (room: RoomRow) => void;
}

export function RoomsTable({ rooms, onBook }: RoomsTableProps) {
  const columns: ColumnsType<RoomRow> = [
    {
      title: "Room type",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <span style={{ color: "#003b95", fontWeight: 500 }}>{value}</span>
      ),
    },
    {
      title: "Guests",
      dataIndex: "capacity",
      key: "capacity",
      render: (value) => (
        <Tag icon={<TeamOutlined />} color="default">
          {value} {value === 1 ? "guest" : "guests"}
        </Tag>
      ),
    },
    {
      title: "Price per night",
      dataIndex: "pricePerNight",
      key: "pricePerNight",
      align: "right",
      render: (value) => (
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          $ {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      align: "right",
      render: (_, room) => (
        <Button type="primary" onClick={() => onBook(room)}>
          Reserve
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rooms}
      pagination={false}
    />
  );
}
