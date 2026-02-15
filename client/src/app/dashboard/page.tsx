'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Reminders from '@/components/Remiander';
import { Employee, Reminder, ProductSale } from '@/types';

const DashboardPage: React.FC = () => {

  /* REMOVED: const router = useRouter() */
  const { token, isLoading } = useAuth(); // Get token
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Employees
        const empRes = await fetch('http://127.0.0.1:8000/api/employees/', { headers });
        const empData = await empRes.json();

        // Map Employees (Backend to Frontend type)
        const mappedEmployees: Employee[] = Array.isArray(empData) ? empData.map((e: any) => ({
          id: String(e.id),
          name: e.name,
          department: "Sales", // Default
          level: "Senior", // Default
          position: "Sales Representative",
          gender: e.gender,
          birthday: e.dob,
          fullAge: 30, // Default
          avatar: e.avatar || "/avatar.png",
          location: "New York",
          mobile: e.mobile_no,
          skype: e.email,
          clients: e.clients_count,
          interactions: e.interactions_count,
          successRate: 85, // Default
          clientsAvailable: "20/30",
          interactionsAvailable: "15/20",
          successRateAvailable: "85/100"
        })) : [];
        setEmployees(mappedEmployees);

        // Fetch Sales (mapped to Products)
        const salesRes = await fetch('http://127.0.0.1:8000/api/sales/', { headers });
        const salesData = await salesRes.json();

        const mappedProducts: ProductSale[] = Array.isArray(salesData) ? salesData.map((s: any) => ({
          id: String(s.id),
          clientName: s.client?.name || "Unknown",
          type: s.product === 'MF' ? 'Mutual Funds' :
            s.product === 'HI' ? 'Health Insurance' :
              s.product === 'GI' ? 'General Insurance' : 'Life Insurance',
          amount: parseFloat(s.amount),
          category: 1, // Default number
          createdDate: s.date,
          priority: "Medium",
          representatives: [s.sales_rep?.avatar || "/avatar.png"]
        })) : [];
        setProducts(mappedProducts);

        // Fetch Interactions (mapped to Reminders)
        const intRes = await fetch('http://127.0.0.1:8000/api/interactions/', { headers });
        const intData = await intRes.json();

        const mappedReminders: Reminder[] = Array.isArray(intData) ? intData.map((i: any) => ({
          id: String(i.id),
          title: `Follow up: ${i.client?.name}`,
          datetime: i.next_follow_up, // Date string
          type: 'call',
          date: i.date?.split('T')[0] || '2023-01-01',
          time: '10:00 AM', // Mock
          duration: '30m', // Mock
          status: 'upcoming'
        })) : [];
        setReminders(mappedReminders);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Junior':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Middle':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Senior':
        return 'bg-green-100 text-green-700 border-green-200';
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
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-1">Welcome back, Evan!</p>
              <h1 className="text-3xl font-bold text-[#00337C]">Dashboard</h1>
            </div>

            {/* Employees Section */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
                <Link href="/employees">
                  <button className="text-sm text-[#3B5BA5] font-medium cursor-pointer">
                    View all →
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {employees.slice(0, 6).map((employee) => (
                  <div key={employee.id} onClick={() => router.push(`/employees/${employee.id}`)}
                    className="flex flex-col items-center bg-[#F4F9FD] py-5 px-2 rounded-3xl cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-3 flex items-center justify-center text-white text-xl font-semibold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center">{employee.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{employee.department}</p>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getLevelColor(employee.level)}`}>
                      {employee.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Sales Section */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Products Sales</h2>
                <Link href="/sales">
                  <button className="text-sm text-[#3B5BA5] cursor-pointer font-medium">
                    View all →
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-3xl p-4">
                    <div className="flex items-center justify-between">
                      {/* Left Side - Product Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg"></div>
                        </div>
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

                      {/* Right Side - Stats */}
                      <div className="flex items-center gap-8">
                        <div className="bg-gray-50 px-4 py-3 rounded-3xl">
                          <h4 className="font-semibold text-gray-900">{product.type}</h4>
                          <div className="grid grid-cols-3 gap-6 mt-2">
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div className="w-80">
            <Reminders reminders={reminders} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;