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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Interaction' : 'Add New Interaction'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
              <input
                name="client"
                value={form.client}
                placeholder="Enter client name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                name="contactNo"
                value={form.contactNo}
                placeholder="Enter contact number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
              <input
                name="employeeId"
                value={form.employeeId}
                placeholder="Enter ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Discussion Summary</label>
            <textarea
              name="summary"
              value={form.summary}
              placeholder="Enter details of conversation..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              rows={3}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Follow Up Date</label>
            <input
              type="date"
              name="followUpDate"
              value={form.followUpDate}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#2D8A4E] py-3 text-white font-semibold shadow-lg hover:bg-[#236b3d] hover:shadow-xl transition transform active:scale-95"
          >
            Save Interaction
          </button>
        </div>
      </div>
    </div>
  );
}
