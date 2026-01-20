import { AutoComplete, Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce"; 

export interface LocationOption {
  city: string;
  country: string;
}

interface LocationDTO {
  id: string;
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
  loc: LocationDTO;
}

function formatLocation(city?: string, country?: string) {
  return [city, country].filter(Boolean).join(', ');
}

export function LocationSearchUI({ onSelect, location }: LocationSearchProps) {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [inputValue, setInputValue] = useState(location ? formatLocation(location.city, location.country) : '');

  const search = useMemo(
    () => 
      debounce(async (value: string) => {
        if (!value) return;
        const res = await fetch(`/api/locations?q=${value}`);
        const data = await res.json();

      setOptions(
        data.map((loc: any) => ({
          key: loc.id,
          value: `${loc.name}, ${loc.country}`,
          label: `${loc.name}, ${loc.country}`,
          loc: {
            id: loc.id,
            city: loc.name,
            country: loc.country,
          },
        }))
      );
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      search.cancel();
    };
  }, [search]);

  return (
    <AutoComplete
      options={options}
      value={inputValue}
      onSearch={(value) => {
        setInputValue(value);
        search(value);
      }}
      onSelect={(_, option: AutoCompleteOption) => {
        const selected = { city: option.loc.city, country: option.loc.country };
        const formatted = formatLocation(option.loc.city, option.loc.country);

        setInputValue(formatted);
        onSelect(selected);
      }}
    >
      <Input placeholder="¿A dónde viajas?" size="large" />
    </AutoComplete> 
  );
}
