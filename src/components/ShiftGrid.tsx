import React, { useEffect, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { ShiftType } from '../types/ShiftType';
import { Time } from '../types/Time';
import { HexColor } from '../types/HexColor';

interface ShiftGridProps {
  shifts: ShiftType[];
  onShiftsChange: (shifts: ShiftType[]) => void;
}

export const ShiftGrid: React.FC<ShiftGridProps> = ({ shifts, onShiftsChange }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      tabulatorRef.current = new Tabulator(tableRef.current, {
        data: shifts,
        reactiveData: true,
        layout: 'fitColumns',
        columns: [
          {
            title: 'Name',
            field: 'name',
            editor: 'input',
            validator: ['required', 'string'],
            sorter: 'string',
          },
          {
            title: 'Color',
            field: 'color',
            editor: customColorEditor,
            formatter: (cell) => {
              const value = cell.getValue()?.toString() || '#000000';
              return `<div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full" style="background-color: ${value}"></div>
                <span>${value}</span>
              </div>`;
            },
            sorter: (a, b) => {
              const aStr = a?.toString() || '';
              const bStr = b?.toString() || '';
              return aStr.localeCompare(bStr);
            },
          },
          {
            title: 'Start Time',
            field: 'startTime',
            editor: customTimeEditor,
            formatter: (cell) => cell.getValue()?.toString().substring(0, 5) || '',
            sorter: (a, b) => {
              const aTime = a?.toString() || '00:00';
              const bTime = b?.toString() || '00:00';
              return aTime.localeCompare(bTime);
            },
          },
          {
            title: 'End Time',
            field: 'endTime',
            editor: customTimeEditor,
            formatter: (cell) => cell.getValue()?.toString().substring(0, 5) || '',
            sorter: (a, b) => {
              const aTime = a?.toString() || '00:00';
              const bTime = b?.toString() || '00:00';
              return aTime.localeCompare(bTime);
            },
          },
          {
            title: 'Actions',
            formatter: function(cell) {
              return '<button class="delete-btn text-red-600 hover:text-red-900"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
            },
            cellClick: function(e, cell) {
              if ((e.target as HTMLElement).closest('.delete-btn')) {
                const row = cell.getRow();
                const id = row.getData().id;
                const newShifts = shifts.filter(shift => shift.id !== id);
                onShiftsChange(newShifts);
                row.delete();
              }
            },
            headerSort: false,
            width: 100,
          },
        ],
        rowAdded: (row) => {
          const data = row.getData();
          onShiftsChange([...shifts, data]);
        },
        rowDeleted: (row) => {
          const data = row.getData();
          const newShifts = shifts.filter(shift => shift.id !== data.id);
          onShiftsChange(newShifts);
        },
      });
    }

    return () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.destroy();
      }
    };
  }, [shifts, onShiftsChange]);

  const customColorEditor = (cell: any, onRendered: any, success: any, cancel: any) => {
    const container = document.createElement('div');
    container.className = 'flex items-center gap-2 p-2';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'w-10 h-10 p-1 rounded-md cursor-pointer';
    colorPicker.value = cell.getValue()?.toString() || '#000000';

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'px-3 py-2 border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500';
    hexInput.value = cell.getValue()?.toString() || '#000000';

    const updateColor = (value: string) => {
      try {
        const color = new HexColor(value);
        colorPicker.value = color.toString();
        hexInput.value = color.toString();
        success(color);
      } catch (error) {
        cancel();
      }
    };

    colorPicker.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      updateColor(target.value);
    });

    hexInput.addEventListener('blur', (e) => {
      const target = e.target as HTMLInputElement;
      updateColor(target.value);
    });

    hexInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateColor((e.target as HTMLInputElement).value);
      }
      if (e.key === 'Escape') {
        cancel();
      }
    });

    container.appendChild(colorPicker);
    container.appendChild(hexInput);

    return container;
  };

  const customTimeEditor = (cell: any, onRendered: any, success: any, cancel: any) => {
    const input = document.createElement('input');
    input.type = 'time';
    input.className = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
    
    const value = cell.getValue();
    input.value = value ? value.toString().substring(0, 5) : '00:00';

    const updateTime = () => {
      try {
        const time = Time.fromString(input.value);
        success(time);
      } catch (error) {
        cancel();
      }
    };

    input.addEventListener('blur', updateTime);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateTime();
      }
      if (e.key === 'Escape') {
        cancel();
      }
    });

    return input;
  };

  const addNewShift = () => {
    const newShift: ShiftType = {
      id: crypto.randomUUID(),
      name: '',
      color: new HexColor('#3b82f6'),
      startTime: new Time(9, 0),
      endTime: new Time(17, 0),
    };
    onShiftsChange([...shifts, newShift]);
  };

  return (
    <div>
      <div ref={tableRef} className="mb-4"></div>
      <button
        onClick={addNewShift}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Shift
      </button>
    </div>
  );
};