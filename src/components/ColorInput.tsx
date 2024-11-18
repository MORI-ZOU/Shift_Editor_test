import React from 'react';
import { HexColor } from '../types/HexColor';

interface ColorInputProps {
  value: HexColor;
  onChange: (color: HexColor) => void;
  className?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newColor = new HexColor(e.target.value);
      onChange(newColor);
    } catch (error) {
      // Invalid color input - do nothing
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value.toString()}
        onChange={handleChange}
        className={`w-10 h-10 p-1 rounded-md cursor-pointer ${className}`}
      />
      <input
        type="text"
        value={value.toString()}
        onChange={(e) => {
          try {
            const newColor = new HexColor(e.target.value);
            onChange(newColor);
          } catch (error) {
            // Invalid hex input - do nothing
          }
        }}
        className="px-3 py-2 border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="#000000"
      />
    </div>
  );
};