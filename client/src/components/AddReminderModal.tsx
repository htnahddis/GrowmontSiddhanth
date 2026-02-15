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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Reminder
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              placeholder="Enter event name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
                <option>Corporate Event</option>
                <option>Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
                <option>Medium Priority</option>
                <option>High Priority</option>
                <option>Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
              <input
                type="time"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Add some description of the event"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              rows={3}
            />
          </div>

          {/* Repeat */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 border border-gray-100">
            <span className="font-medium text-gray-700">Repeat Reminder</span>
            <input type="checkbox" className="h-5 w-5 accent-green-600 rounded" />
          </div>

          <div className="flex gap-2">
            {["Daily", "Weekly", "Monthly"].map((r) => (
              <button
                key={r}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-green-600 hover:text-white hover:border-green-600 transition"
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <button
                key={d}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium hover:bg-green-600 hover:text-white transition"
              >
                {d}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" /> Repeat every day
          </label>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button className="w-full rounded-xl bg-[#2D8A4E] py-3 text-white font-semibold shadow-lg hover:bg-[#236b3d] hover:shadow-xl transition transform active:scale-95 cursor-pointer">
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReminderModal;
