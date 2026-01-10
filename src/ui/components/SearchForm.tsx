"use client";

import { useState } from "react";
import { Input, DatePicker, Button, Space } from 'antd';
import { useAppDispatch } from '@/application/hooks';
import { searchAvailableRooms } from '@/application/slices/searchSlice';
import dayjs from 'dayjs';

export function SearchForm() {
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState('');
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const onSearch = () => {
    if (!dates) return;

    dispatch(
      searchAvailableRooms({
        location,
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      })
    );
  };

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%', marginBottom: '16px' }}>
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <DatePicker.RangePicker
        value={dates}
        onChange={(value) => setDates(value as [dayjs.Dayjs, dayjs.Dayjs] | null)}
        style={{ width: '100%' }}
      />

      <Button type="primary" onClick={onSearch}>
        Search
      </Button>
    </Space>
  );
}