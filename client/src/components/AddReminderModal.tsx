"use client";

import React from "react";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D8A4E]">
            Add Reminder
          </h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            className="w-full rounded-lg border px-4 py-2"
          />

          <select className="w-full rounded-lg border px-4 py-2">
            <option>Corporate Event</option>
            <option>Personal</option>
          </select>

          <select className="w-full rounded-lg border px-4 py-2">
            <option>Medium Priority</option>
            <option>High Priority</option>
            <option>Low Priority</option>
          </select>

          <div className="flex gap-3">
            <input
              type="date"
              className="w-full rounded-lg border px-4 py-2"
            />
            <input
              type="time"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <textarea
            placeholder="Add some description of the event"
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
          />

          {/* Repeat */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="font-medium">Repeat Reminder</span>
            <input type="checkbox" className="h-5 w-5 accent-green-600" />
          </div>

          <div className="flex gap-2">
            {["Daily", "Weekly", "Monthly"].map((r) => (
              <button
                key={r}
                className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-green-600 hover:text-white"
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <button
                key={d}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-green-600 hover:text-white"
              >
                {d}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Repeat every day
          </label>

          <input
            type="time"
            className="w-full rounded-lg border px-4 py-2"
          />

          <button className="w-full rounded-xl bg-[#2D8A4E] py-2 text-white hover:bg-[#236b3d] transition-colors cursor-pointer">
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReminderModal;
