import React from 'react';
import { Time } from '../types/Time';

interface TimeInputProps {
  value: Time;
  onChange: (time: Time) => void;
  className?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newTime = Time.fromString(e.target.value);
      onChange(newTime);
    } catch (error) {
      // Invalid time input - do nothing
    }
  };

  return (
    <input
      type="time"
      value={value.toString().substring(0, 5)}
      onChange={handleChange}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};