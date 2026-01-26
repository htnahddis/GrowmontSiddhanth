'use client';

import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData?: any;
}

export default function AddInteractionModal({ isOpen, onClose, onSave, initialData }: Props) {
const [form, setForm] = useState({
  client: '',
  date: '',
  contactNo: '',
  employeeId: '',
  summary: '',
  followUpDate: '',
});

// Reset form when modal opens/closes or initialData changes
useEffect(() => {
  if (isOpen) {
    if (initialData) {
      setForm({
        client: initialData.client || '',
        date: initialData.date || '',
        contactNo: initialData.contactNo || '',
        employeeId: initialData.employeeId?.toString() || '',
        summary: initialData.summary || '',
        followUpDate: initialData.followUpDate || '',
      });
    } else {
      // Reset to empty if no initialData (i.e., Add mode)
      setForm({
        client: '',
        date: '',
        contactNo: '',
        employeeId: '',
        summary: '',
        followUpDate: '',
      });
    }
  }
}, [isOpen, initialData]);
  if (!isOpen) return null;

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-700">
  {initialData ? 'Edit Interaction' : 'Add New Interaction'}
          </h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="space-y-4">
          <input
            name="client"
            value={form.client}
            placeholder="Client Name"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="contactNo"
            value={form.contactNo}
            placeholder="Contact Number"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="employeeId"
            value={form.employeeId}
            placeholder="Employee ID"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <textarea
            name="summary"
            value={form.summary}
            placeholder="Discussion Summary"
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
            onChange={handleChange}
          />

          <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#2D8A4E] py-2 text-white hover:bg-[#236b3d]"
          >
            Save Interaction
          </button>
        </div>
      </div>
    </div>
  );
}
