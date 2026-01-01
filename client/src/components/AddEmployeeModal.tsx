"use client";

import React from "react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-700">
            Add Employee
          </h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Employee Name"
            className="w-full rounded-lg border px-4 py-2"
          />

          <div>
            <label className="text-sm text-gray-500">Department</label>
            <select className="w-full rounded-lg border px-4 py-2">
              <option>Corporate Event</option>
              <option>HR</option>
              <option>Engineering</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Role</label>
            <select className="w-full rounded-lg border px-4 py-2">
              <option>Manager</option>
              <option>Developer</option>
              <option>Designer</option>
            </select>
          </div>

          <div className="flex gap-3">
            <input
              type="date"
              className="w-full rounded-lg border px-4 py-2"
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <textarea
            placeholder="Add some description of the event"
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
          />

          {/* Activation */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="font-medium">Activation</span>
            <input type="checkbox" className="h-5 w-5 accent-green-600" />
          </div>

          {/* Gender */}
          <div>
            <p className="mb-2 text-sm text-gray-500">Gender</p>
            <div className="flex gap-2">
              {["Male", "Female", "Others"].map((g) => (
                <button
                  key={g}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-green-600 hover:text-white"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Workdays */}
          <div>
            <p className="mb-2 text-sm text-gray-500">Workdays</p>
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
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" /> Repeat every day
            </label>
          </div>

          <input
            type="time"
            className="w-full rounded-lg border px-4 py-2"
          />

          <button className="w-full rounded-xl py-2 text-white hover:bg-[#236b3d] transition-colors cursor-pointer bg-[#2D8A4E]">
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
