'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import data from '@/data/infoPortalData.json';

type SalesRow = {
  id: number;
  client: string;
  date: string;
  contactNo: string;
  salesRep: string;
  product: 'Yes' | 'No';
  company: string;
  amount: string;
  remark: string;
};

type InteractionRow = {
  id: number;
  client: string;
  date: string;
  contactNo: string;
  summary: string;
  callStatus: 'Yes' | 'No';
  followUpDate: string;
  followUpTime: string;
};

export default function InfoPortalPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'interactions'>('interactions');

  return (
    <div className=" bg-[#F6FAFD] min-h-screen">
      <Sidebar />
        <Navbar />

      <div className="flex-1 ml-64 mt-16 p-6">

        <div className="p-6">
              <h1 className="text-3xl font-bold text-[#00337C] mb-5">Info Portal</h1>

          {/* Tabs */}
          <div className="flex gap-4 bg-white p-2 rounded-xl w-fit mb-6">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'sales'
                  ? 'bg-[#E9EFF5] text-[#00337C]'
                  : 'text-gray-500'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'interactions'
                  ? 'bg-[#E9EFF5] text-[#00337C]'
                  : 'text-gray-500'
              }`}
            >
              Interactions
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {activeTab === 'sales' ? 'Sales' : 'Client Interactions'}
                </h2>
                <p className="text-sm text-gray-500">
                  A descriptive body text comes here
                </p>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm border rounded-lg">Delete</button>
                <button className="px-4 py-2 text-sm border rounded-lg">Filters</button>
                <button className="px-4 py-2 text-sm border rounded-lg">Export</button>
                <button className="px-4 py-2 text-sm bg-[#1C7947] text-white rounded-lg">
                  + Add new
                </button>
              </div>
            </div>

            {/* TABLE */}
            {activeTab === 'sales' ? (
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-3 text-left">Client</th>
                    <th>Date</th>
                    <th>Contact No</th>
                    <th>Sales Representative</th>
                    <th>Product</th>
                    <th>Company</th>
                    <th>Amount</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.sales as SalesRow[]).map(row => (
                    <tr key={row.id} className="border-b last:border-none">
                      <td className="py-3 font-medium">{row.client}</td>
                      <td>{row.date}</td>
                      <td>{row.contactNo}</td>
                      <td>{row.salesRep}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            row.product === 'Yes'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {row.product}
                        </span>
                      </td>
                      <td>{row.company}</td>
                      <td>{row.amount}</td>
                      <td>{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-3 text-left">Client</th>
                    <th>Date</th>
                    <th>Contact No</th>
                    <th>Discussion Summary</th>
                    <th>Call Status</th>
                    <th>Follow up Date</th>
                    <th>Follow up Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.interactions as InteractionRow[]).map(row => (
                    <tr key={row.id} className="border-b last:border-none">
                      <td className="py-3 font-medium">{row.client}</td>
                      <td>{row.date}</td>
                      <td>{row.contactNo}</td>
                      <td>{row.summary}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            row.callStatus === 'Yes'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {row.callStatus}
                        </span>
                      </td>
                      <td>{row.followUpDate}</td>
                      <td>{row.followUpTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
