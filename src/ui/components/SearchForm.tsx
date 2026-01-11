"use client";

import { useState } from "react";
import { Input, DatePicker, Button, Flex } from 'antd';
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
    <Flex gap="middle" justify="center" align="center" style={{ marginBottom: 16 }}>
      <Input
        size="large"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ width: 300 }}
      />

      <DatePicker.RangePicker
        size="large"
        value={dates}
        onChange={(value) => setDates(value as [dayjs.Dayjs, dayjs.Dayjs] | null)}
        style={{ width: 300 }}
      />

      <Button size="large" type="primary" onClick={onSearch}>
        Search
      </Button>
    </Flex>
  );
}