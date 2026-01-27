"use client";

import { Button, Table } from "antd";
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (value) => `${value} personas`,
    },
    {
      title: "Price / night",
      dataIndex: "pricePerNight",
      key: "pricePerNight",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, room) => (
        <Button type="primary" onClick={() => onBook(room)} target="_blank">
          Booking
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
