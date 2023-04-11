import React from "react";

interface CurrencyDropdownProps {
  id: string;
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  id,
  value,
  options,
  onChange,
}) => {
  return (
    <select id={id} value={value} onChange={onChange}>
      {options.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};
