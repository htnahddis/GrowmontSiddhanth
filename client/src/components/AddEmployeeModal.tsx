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
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Employee Name"
            className="w-full rounded-lg border px-4 py-2"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full rounded-lg border px-4 py-2"
          />

          <input
            name="mobile_no"
            value={form.mobile_no}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Gender */}
          <div>
            <p className="mb-2 text-sm text-gray-500">Gender</p>
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
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm
                    ${form.gender === g.value
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-600 hover:text-white"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <input
            name="dob"
            value={form.dob}
            onChange={handleChange}
            type="date"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Avatar */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl py-2 text-white transition-colors bg-[#2D8A4E] hover:bg-[#236b3d]"
          >
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
