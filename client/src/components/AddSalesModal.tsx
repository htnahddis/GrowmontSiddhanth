'use client';

import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData?: any;
}

interface Employee {
  id: number;
  name: string;
}

export default function AddSalesModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    client: '',
    date: '',
    contactNo: '',
    employeeId: '',
    product: 'MF', // Default
    company: '',
    amount: '',
    frequency: 'M', // Default
    remark: '',
  });

  // Fetch employees and set initial data
  useEffect(() => {
    if (isOpen) {
      // Fetch employees
      fetch('http://127.0.0.1:8000/api/employees/')
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error("Failed to fetch employees", err));

      if (initialData) {
        setForm({
          client: initialData.client || '',
          date: initialData.date || '',
          contactNo: initialData.contactNo || '',
          employeeId: initialData.employeeId?.toString() || '',
          product: initialData.product || 'MF',
          company: initialData.company || '',
          amount: initialData.amount || '',
          frequency: initialData.frequency || 'M',
          remark: initialData.remark || '',
        });
      } else {
        setForm({
          client: '',
          date: '',
          contactNo: '',
          employeeId: '',
          product: 'MF',
          company: '',
          amount: '',
          frequency: 'M',
          remark: '',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const payload = {
      client: form.client,
      contactNo: form.contactNo,
      date: form.date,
      company: form.company,
      amount: form.amount,
      remark: form.remark,
      product: form.product,
      frequency: form.frequency,
      employeeId: form.employeeId // Ensure this is sent
    };

    console.log('Modal sending to Sales page:', payload);
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Sale' : 'Add New Sale'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          {/* Row 1: Client & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
              <input
                name="client"
                value={form.client}
                placeholder="Enter name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                name="contactNo"
                value={form.contactNo}
                placeholder="Enter number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2: Sales Rep & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sales Rep</label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="">Select Rep</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
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
          </div>

          {/* Row 3: Product & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product</label>
              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="MF">Mutual Funds</option>
                <option value="HI">Health Insurance</option>
                <option value="GI">General Insurance</option>
                <option value="LI">Life Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Frequency</label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="M">Monthly</option>
                <option value="Q">Quarterly</option>
                <option value="Y">Yearly</option>
              </select>
            </div>
          </div>

          {/* Row 4: Company & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
              <input
                name="company"
                value={form.company}
                placeholder="Company Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
              <input
                name="amount"
                value={form.amount}
                placeholder="0.00"
                type="number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remark"
              value={form.remark}
              placeholder="Enter any additional notes..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              rows={3}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-[#2D8A4E] py-3 text-white font-semibold shadow-lg hover:bg-[#236b3d] hover:shadow-xl transition transform active:scale-95"
          >
            {initialData ? 'Update Sale' : 'Save New Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
