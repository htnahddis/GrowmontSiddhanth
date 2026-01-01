'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import employeesData from '@/data/employees.json';
import productsData from '@/data/products.json';

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
  location: string;
  mobile: string;
  skype: string;
  clients: number;
  interactions: number;
  successRate: number;
  clientsAvailable: string;
  interactionsAvailable: string;
  successRateAvailable: string;
}

interface Client {
  id: string;
  name: string;
  type: string;
  specialty: string;
}

interface ProductSale {
  id: string;
  clientName: string;
  type: string;
  amount: number;
  category: number;
  createdDate: string;
  priority: 'Low' | 'Medium' | 'High';
  representatives: string[];
}

const EmployeeDetailPage: React.FC = () => {
  const params = useParams();
  const employeeId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'product-sales' | 'clients' | 'overview'>('clients');
  
  const employee = employeesData.find((emp: any) => emp.id === employeeId) as Employee | undefined;
  const products: ProductSale[] = productsData;

  // Mock clients data
  const clients: Client[] = [
    { id: '1', name: 'Shawn Stone', type: 'Insurance', specialty: 'Insurance' },
    { id: '2', name: 'Randy Delgado', type: 'Mutual Funds', specialty: 'Mutual Funds' },
    { id: '3', name: 'Emily Tyler', type: 'ETF', specialty: 'ETF' },
    { id: '4', name: 'Blake Silva', type: 'Insurance', specialty: 'Insurance' }
  ];

  if (!employee) {
    return <div>Employee not found</div>;
  }

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-orange-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#1e3a8a]">About Employee</h1>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Employee Info */}
          <div className="w-96 bg-white rounded-lg border border-gray-200 p-6">
            {/* Profile */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-blue-100">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-4">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
            </div>

            {/* Main Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Main info</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Position</label>
                  <input
                    type="text"
                    value={employee.position}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Department</label>
                  <input
                    type="text"
                    value={employee.department}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={employee.location || 'Mumbai'}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Birthday Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={employee.birthday}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={employee.email}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Mobile Number</label>
                  <input
                    type="text"
                    value={employee.mobile || '+1 675 346 23-10'}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Skype</label>
                  <input
                    type="text"
                    value={employee.skype || 'Evan 2256'}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveTab('product-sales')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'product-sales'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Product Sales
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'clients'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Clients
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#2D8A4E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>

              {activeTab === 'product-sales' && (
                <button className="ml-auto p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            {activeTab === 'clients' && (
              <div className="grid grid-cols-4 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold mb-3 ring-4 ring-blue-100">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.specialty}</p>
                      <span className={`text-xs px-3 py-1 rounded-full border mt-2 ${getLevelColor('Middle')}`}>
                        Middle
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'product-sales' && (
              <div className="space-y-4">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg"></div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{product.id}</p>
                          <h3 className="font-semibold text-gray-900">{product.clientName}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Created {product.createdDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mx-6">
                        <svg className={`w-5 h-5 ${getPriorityColor(product.priority)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className={`text-sm font-medium ${getPriorityColor(product.priority)}`}>
                          {product.priority}
                        </span>
                      </div>

                      <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{product.type}</h4>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-semibold text-gray-900">{product.amount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-semibold text-gray-900">{product.category}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Representativ</p>
                            <div className="flex -space-x-2 mt-1">
                              {product.representatives.slice(0, 3).map((rep, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                                ></div>
                              ))}
                              {product.representatives.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-[#3B5BA5] border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                                  +
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(12 / 16) * 351.858} 351.858`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold text-[#3B82F6]">12</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Clients</h3>
                  <p className="text-sm text-gray-500">12/16 days available</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#EF4444"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(6 / 12) * 351.858} 351.858`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold text-[#EF4444]">6</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Interactions</h3>
                  <p className="text-sm text-gray-500">6/12 days available</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#8B5CF6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(42 / 50) * 351.858} 351.858`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold text-[#8B5CF6]">42</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Success Rate</h3>
                  <p className="text-sm text-gray-500">42/50 days available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDetailPage;