"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DatePicker, Button, Flex } from 'antd';
import { LocationSearchUI } from "./LocationSearchUI";
import { LocationSearch } from "@/domain/value-objects/LocationSearch";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

export function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [location, setLocation] = useState<LocationSearch>({ city: params.get("city") || '', country: params.get("country") || '' });
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(params.get("from") && params.get("to") ? [dayjs(params.get("from")!), dayjs(params.get("to")!)] : null);

  const onSearch = () => {
    if (!dates) return;
    if (!location.city && !location.country) return;

    const from = dates[0].format("YYYY-MM-DD");
    const to = dates[1].format("YYYY-MM-DD");

    router.push(
      `/search?city=${location.city}&country=${location.country}&from=${from}&to=${to}`
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