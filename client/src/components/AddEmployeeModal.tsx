"use client";

import React, { useState } from "react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: "",
    gender: "M",
    dob: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("mobile_no", form.mobile_no);
    formData.append("gender", form.gender);
    formData.append("dob", form.dob);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("http://127.0.0.1:8000/api/employees/", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      onSuccess?.();
      onClose();
    }
    const result = await res.json();

    if (!res.ok) {
      console.error("Backend error:", result);
      alert(JSON.stringify(result));
      return;
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C7947]/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Employee
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Employee Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              name="mobile_no"
              value={form.mobile_no}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
            <div className="flex gap-2">
              {[
                { label: "Male", value: "M" },
                { label: "Female", value: "F" },
                { label: "Others", value: "O" },
              ].map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g.value })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition font-medium
                    ${form.gender === g.value
                      ? "bg-[#2D8A4E] text-white border-[#2D8A4E]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <input
              name="dob"
              value={form.dob}
              onChange={handleChange}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-[#2D8A4E] py-3 text-white font-semibold shadow-lg hover:bg-[#236b3d] hover:shadow-xl transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
