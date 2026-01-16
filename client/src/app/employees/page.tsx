'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AddEmployeeModal from '@/components/AddEmployeeModal';

interface Employee {
  id: number;
  name: string;
  email: string;
  gender: string;
  dob: string;
  avatar: string | null;
  clients_count: number;
  sales_count: number;
}

const EmployeesPage: React.FC = () => {
  const router = useRouter();
  const [openEmployee, setOpenEmployee] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'activity'>('list');
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/employees/')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-200 rounded-3xl p-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-2 rounded-3xl font-medium ${
                  activeTab === 'list'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-2 rounded-3xl font-medium ${
                  activeTab === 'activity'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'text-gray-600'
                }`}
              >
                Activity
              </button>
            </div>

            <button
              className="flex items-center gap-2 bg-[#2D8A4E] text-white px-4 py-2 rounded-lg"
              onClick={() => setOpenEmployee(true)}
            >
              Add Employee
            </button>
          </div>
        </div>

        <AddEmployeeModal
          isOpen={openEmployee}
          onClose={() => setOpenEmployee(false)}
        />

        {activeTab === 'list' && (
          <div className="divide-y divide-gray-200">
            {employees.map(emp => (
              <div
                key={emp.id}
                onClick={() => router.push(`/employees/${emp.id}`)}
                className="bg-white p-6 rounded-3xl mb-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {emp.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{emp.name}</h3>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>
                  </div>

                  <div className="w-32">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p>{emp.gender}</p>
                  </div>

                  <div className="w-32">
                    <p className="text-xs text-gray-500">Birthday</p>
                    <p>{emp.dob}</p>
                  </div>

                  <div className="w-20">
                    <p className="text-xs text-gray-500">Clients</p>
                    <p>{emp.clients_count}</p>
                  </div>

                  <div className="w-20">
                    <p className="text-xs text-gray-500">Sales</p>
                    <p>{emp.sales_count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeesPage;
