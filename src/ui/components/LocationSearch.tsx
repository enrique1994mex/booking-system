import { AutoComplete, Input } from "antd";
import { useState } from "react";
import { Location } from "@/domain/entities/Location";
import debounce from "lodash.debounce"; 

interface LocationSearchProps {
  onSelect: (loc: Location) => void;
}

interface AutoCompleteOption {
  key: string;
  value: string;
  label: string;
  loc: Location;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);

  const search = debounce(async (value: string) => {
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
  }, 300);

  return (
    <AutoComplete
      options={options}
      onSearch={search}
      onSelect={(_, option: AutoCompleteOption) => onSelect(option.loc)}
    >
      <Input placeholder="¿A dónde viajas?" size="large" />
    </AutoComplete>
  );
}
