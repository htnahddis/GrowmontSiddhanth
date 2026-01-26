'use client';

import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
    initialData?: any; // Add this
}

export default function AddSalesModal({ isOpen, onClose, onSave, initialData }: Props) {
const [form, setForm] = useState({
  client: '',
  date: '',
  contactNo: '',
  employeeId: '',
  company: '',
  amount: '',
  remark: '',
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
        company: initialData.company || '',
        amount: initialData.amount || '',
        remark: initialData.remark || '',
      });
    } else {
      // Reset to empty if no initialData (i.e., Add mode)
      setForm({
        client: '',
        date: '',
        contactNo: '',
        employeeId: '',
        company: '',
        amount: '',
        remark: '',
      });
    }
  }
}, [isOpen, initialData]);
  if (!isOpen) return null;

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    // ✅ PERFECT payload bridge to Sales page
    const payload = {
      client: form.client,          // "Sidhdanth" (string)
       // "1" (string)
      contactNo: form.contactNo,
      date: form.date,
      company: form.company,
      amount: form.amount,
      remark: form.remark
    };

    console.log('Modal sending to Sales page:', payload);  // DEBUG

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-700">{initialData?'Edit Sale': 'Add Sale'}</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>
<div>
        
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
            name="company"
            value={form.company}
            placeholder="Company"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <input
            name="amount"
            value={form.amount}
            placeholder="Amount"
            type="number"
            className="w-full rounded-lg border px-4 py-2"
            onChange={handleChange}
          />

          <textarea
            name="remark"
            value={form.remark}
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
