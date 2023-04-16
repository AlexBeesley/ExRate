import React from "react";

interface CurrencyDropdownProps {
  id: string;
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CurrencyDropdown({ id, value, options, onChange }: CurrencyDropdownProps): JSX.Element {
  return (
    <select id={id} value={value} onChange={onChange}>
      {options.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
}
