'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
}

export default function AddSalesModal({ isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    client: '',
    contactNo: '',
    date: '',
    employeeId: '',
    company: '',
    amount: '',
    remark: '',
  });

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
          <h2 className="text-lg font-semibold text-blue-700">Add Sale</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="space-y-4">
          <input
            name="client"
            placeholder="Client Name"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="contactNo"
            placeholder="Contact Number"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="employeeId"
            placeholder="Sales Rep ID"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="company"
            placeholder="Company"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="amount"
            placeholder="Amount"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <textarea
            name="remark"
            placeholder="Remarks"
            className="w-full rounded-lg border px-4 py-2"
            rows={3}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#2D8A4E] py-2 text-white hover:bg-[#236b3d]"
          >
            Save Sale
          </button>
        </div>
      </div>
    </div>
  );
}
