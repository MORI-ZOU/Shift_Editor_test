import React, { useState } from 'react';
import { ShiftGrid } from './components/ShiftGrid';
import { ShiftType } from './types/ShiftType';
import { Time } from './types/Time';
import { HexColor } from './types/HexColor';
import { Clock } from 'lucide-react';

function App() {
  const [shifts, setShifts] = useState<ShiftType[]>([
    {
      id: '1',
      name: 'Morning Shift',
      color: new HexColor('#3b82f6'),
      startTime: new Time(9, 0),
      endTime: new Time(17, 0),
    },
    {
      id: '2',
      name: 'Evening Shift',
      color: new HexColor('#ef4444'),
      startTime: new Time(17, 0),
      endTime: new Time(1, 0),
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <ShiftGrid shifts={shifts} onShiftsChange={setShifts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;