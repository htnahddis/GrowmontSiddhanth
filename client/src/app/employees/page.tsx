'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import employeesData from '@/data/employees.json';
import AddEmployeeModal from '@/components/AddEmployeeModal';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  level: 'Junior' | 'Middle' | 'Senior';
  position: string;
  gender: string;
  birthday: string;
  fullAge: number;
  avatar: string;
  backlogTasks: number;
  clients: number;
  sales: number;
}

const EmployeesPage: React.FC = () => {
  const router= useRouter()
    const [openEmployee, setOpenEmployee] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'activity'>('list');
  const employees: Employee[] = employeesData;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Junior':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Middle':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Senior':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          
          <div className="flex items-center gap-3">
            {/* Tab Buttons */}
            <div className="flex bg-gray-200 rounded-3xl p-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-2 rounded-3xl font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-2 rounded-3xl font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Activity
              </button>
            </div>

            {/* Filter Icon */}
            <button className="p-2 text-gray-600 bg-white cursor-pointer hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            {/* Add Employee Button */}
            <button className="flex items-center gap-2 bg-[#2D8A4E] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#236b3d] transition-colors cursor-pointer"
            onClick={() => setOpenEmployee(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        <AddEmployeeModal
        isOpen={openEmployee}
        onClose={() => setOpenEmployee(false)}
      />

        {/* Content Area */}
        <div className="bg-[#F4F9FD] rounded-3xl">
          {activeTab === 'list' ? (
            <div className="divide-y divide-gray-200 ">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => router.push(`/employees/${employee.id}`)}
                  className="bg-white p-6 hover:bg-gray-50 transition-colors rounded-3xl mb-3 cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="w-32">
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="font-medium text-gray-900">{employee.gender}</p>
                    </div>

                    {/* Birthday */}
                    <div className="w-32">
                      <p className="text-xs text-gray-500 mb-1">Birthday</p>
                      <p className="font-medium text-gray-900">{employee.birthday}</p>
                    </div>

                    {/* Full Age */}
                    <div className="w-20">
                      <p className="text-xs text-gray-500 mb-1">Full age</p>
                      <p className="font-medium text-gray-900">{employee.fullAge}</p>
                    </div>

                    {/* Position */}
                    <div className="w-32">
                      <p className="text-xs text-gray-500 mb-1">Position</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{employee.position}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(employee.level)}`}>
                          {employee.level}
                        </span>
                      </div>
                    </div>

                    {/* More Options */}
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Activity View */
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6">
                {employees.slice(0, 4).map((employee) => (
                  <div key={employee.id} className="bg-white rounded-3xl p-6">
                    {/* Employee Header */}
                    <div className="flex flex-col items-center mb-6 bg-[#F4F9FD] p-5 rounded-3xl">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold mb-3 ring-4 ring-white">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-center">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <span className={`text-xs px-3 py-1 rounded-full border mt-2 ${getLevelColor(employee.level)}`}>
                        {employee.level}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{employee.backlogTasks}</p>
                        <p className="text-xs text-gray-500 mt-1">Backlog<br/>tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{employee.clients}</p>
                        <p className="text-xs text-gray-500 mt-1">Clients</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{employee.sales}</p>
                        <p className="text-xs text-gray-500 mt-1">Sales</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <span className="text-sm text-gray-600">1-8 of 28</span>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeesPage;