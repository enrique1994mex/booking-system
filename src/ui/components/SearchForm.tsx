"use client";

import { useState } from "react";
import { DatePicker, Button, Flex } from 'antd';
import { LocationSearchUI } from "./LocationSearchUI";
import { LocationSearch } from "@/domain/value-objects/LocationSearch";
import { useAppDispatch } from '@/application/hooks';
import { searchAvailableAccomodations } from '@/application/slices/searchSlice';
import dayjs from 'dayjs';

export function SearchForm() {
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState<LocationSearch>({ city: '', country: '' });
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const onSearch = () => {
    if (!dates) return;
    if (!location.city && !location.country) return;

    dispatch(
      searchAvailableAccomodations({
        location,
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      })
    );
  };

  return (
    <Flex gap="middle" justify="center" align="center" style={{ marginBottom: 16 }}>
      <LocationSearchUI onSelect={(loc) => setLocation({ city: loc.name, country: loc.country })} />

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