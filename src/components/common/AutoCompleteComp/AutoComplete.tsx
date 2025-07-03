import React, { useState } from "react";

interface AutocompleteProps<T> {
  data: T[];
  onSelect: (item: T) => void;
  searchFields: (keyof T | string)[];
  displayValue: (item: T) => string;
  placeholder?: string;
}

export function Autocomplete<T extends object>({
  data,
  onSelect,
  searchFields,
  displayValue,
  placeholder = "Search...",
}: AutocompleteProps<T>) {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<T[]>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value) return setFiltered([]);

    const results = data.filter((item) =>
      searchFields.some((field) => {
        const keys = field.split(".");
        let val: any = item;
        for (const key of keys) {
          val = val?.[key];
        }
        return String(val || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );

    setFiltered(results.slice(0, 5));
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setInput("");
    setFiltered([]);
  };

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={input}
        onChange={handleInput}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      {filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full mt max-h-60 overflow-y-auto">
          {filtered.map((item, i) => (
            <li
              key={i}
              className="px-2 py-2 hover: hover:bg-blue-50  cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {displayValue(item)}
            </li>
          ))}

        </ul>
      )  }
    </div>
  );
}
