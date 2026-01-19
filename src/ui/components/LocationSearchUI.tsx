import { AutoComplete, Input } from "antd";
import { useMemo, useState, useEffect } from "react";
import { Location } from "@/domain/entities/Location";
import debounce from "lodash.debounce"; 

export interface LocationOption {
  city: string;
  country: string;
}

interface LocationSearchProps {
  onSelect: (loc: LocationOption) => void;
  location?: LocationOption;
}

interface AutoCompleteOption {
  key: string;
  value: string;
  label: string;
  loc: Location;
}

export function LocationSearchUI({ onSelect, location }: LocationSearchProps) {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);

  const search = useMemo(
    () => 
      debounce(async (value: string) => {
        if (!value) return;
        const res = await fetch(`/api/locations?q=${value}`);
        const data = await res.json();

      setOptions(
        data.map((loc: Location) => ({
          key: loc.id,
          value: `${loc.name}, ${loc.country}`,
          label: `${loc.name}, ${loc.country}`,
          loc,
        }))
      );
    }, 300),
    []
  );

  const inputValue = location
  ? `${location.city}, ${location.country}`
  : '';

  useEffect(() => {
    if (location) {
      search(`${location.city}`);
    }
  }, [location, search]);

  return (
    <AutoComplete
      options={options}
      value={inputValue}
      onSearch={search}
      onSelect={(_, option: AutoCompleteOption) => onSelect({city: option.loc.name, country: option.loc.country})}
    >
      <Input placeholder="¿A dónde viajas?" size="large" />
    </AutoComplete>
  );
}
