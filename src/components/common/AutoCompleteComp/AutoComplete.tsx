import React, { useState, useRef, useEffect } from "react";

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
  const [input, setInput] = useState<string>("");
  const [filtered, setFiltered] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInput("")
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim()) {
      setFiltered([]);
      setIsOpen(false);
      return;
    }

    const results = data.filter((item) =>
      searchFields.some((field) => {
        const keys = field.split(".");
        let val: any = item;
        for (const key of keys) val = val?.[key];
        return String(val || "").toLowerCase().includes(value.toLowerCase());
      })
    );

    setFiltered(results.slice(0, 5));
    setIsOpen(true);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setInput("");
    setFiltered([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <input
        type="text"
        value={input}
        onChange={handleInput}
        placeholder={placeholder}
        className="pr-1 py-2 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
      />

      {isOpen && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <li
                key={i}
                className="px-2 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {displayValue(item)}
              </li>
            ))
          ) : (
            <li className="px-2 py-2 text-gray-500">No matching profiles</li>
          )}
        </ul>
      )}
    </div>
  );
}
