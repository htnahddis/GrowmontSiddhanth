'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import data from '@/data/infoPortalData.json';
import toast from 'react-hot-toast';

/* ✅ ADD THESE IMPORTS */
import AddSalesModal from '@/components/AddSalesModal';
import AddInteractionModal from '@/components/AddInteractionsModal';

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
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] =
    useState<'sales' | 'interactions'>('interactions');

  const [sales, setSales] = useState<SalesRow[]>(data.sales);
  const [interactions, setInteractions] =
    useState<InteractionRow[]>(data.interactions);

  const filteredSales = sales.filter(s =>
    s.client.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInteractions = interactions.filter(i =>
    i.client.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= FETCH FROM DB ================= */

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sales/')
      .then(res => (res.ok ? res.json() : []))
      .then(dbSales => {
        if (dbSales.length) {
          setSales(
            dbSales.map((s: any) => ({
              id: s.id,
              client: s.client.name,
              date: s.date,
              contactNo: s.client.contact_number,
              salesRep: s.sales_rep.name,
              product: 'Yes',
              company: s.company,
              amount: s.amount,
              remark: s.remarks,
            }))
          );
        }
      });

    fetch('http://127.0.0.1:8000/api/interactions/')
      .then(res => (res.ok ? res.json() : []))
      .then(dbInteractions => {
        if (dbInteractions.length) {
          setInteractions(
            dbInteractions.map((i: any) => ({
              id: i.id,
              client: i.client.name,
              date: i.date,
              contactNo: i.client.contact_number,
              summary: i.discussion_notes,
              callStatus: 'Yes',
              followUpDate: i.next_follow_up,
              followUpTime: '10:00',
            }))
          );
        }
      });
  }, []);

  /* ================= EXPORT ================= */

  const handleExport = () => {
    const url =
      activeTab === 'sales'
        ? 'http://127.0.0.1:8000/api/export/sales/'
        : 'http://127.0.0.1:8000/api/export/interactions/';

    window.open(url, '_blank');
  };

  /* ================= IMPORT ================= */

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    const url =
      activeTab === 'sales'
        ? 'http://127.0.0.1:8000/api/import/sales/'
        : 'http://127.0.0.1:8000/api/import/interactions/';

    await fetch(url, { method: 'POST', body: formData });
    toast.success('Imported successfully!');
    window.location.reload();
  };

  /* ================= ADD ================= */

  const handleAdd = async (payload: any) => {
    const url =
      activeTab === 'sales'
        ? 'http://127.0.0.1:8000/api/sales/create/'
        : 'http://127.0.0.1:8000/api/interactions/create/';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('Added successfully');
      setShowModal(false);
      window.location.reload();
    } else {
      toast.error('Failed to add');
    }
  };

  const handleDelete = async (id: number) => {
    const url =
      activeTab === 'sales'
        ? `http://127.0.0.1:8000/api/sales/${id}/delete/`
        : `http://127.0.0.1:8000/api/interactions/${id}/delete/`;

    const res = await fetch(url, { method: 'DELETE' });

    if (res.ok) {
      toast.success('Deleted');
      setSales(prev => prev.filter(r => r.id !== id));
      setInteractions(prev => prev.filter(r => r.id !== id));
    } else {
      toast.error('Delete failed');
    }
  };

  return (
    <div className=" bg-[#F6FAFD] min-h-screen">
      <Sidebar />
      <Navbar />

      <div className="ml-64 mt-16">
        <div className="p-6">
          {/* HEADER & TABS */}
          <div className="flex bg-gray-200 rounded-3xl p-1 w-fit mb-6">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-2 rounded-3xl font-medium transition-colors ${
                activeTab === 'sales'
                  ? 'bg-[#2D8A4E] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sales
            </button>

            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-6 py-2 rounded-3xl font-medium transition-colors ${
                activeTab === 'interactions'
                  ? 'bg-[#2D8A4E] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Interactions
            </button>
          </div>

          {/* CARD */}
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
                <button className="px-4 py-2 text-sm border rounded-lg">
                  Delete
                </button>
                <button className="px-4 py-2 text-sm border rounded-lg">
                  Filters
                </button>

                <label className="px-4 py-2 text-sm border rounded-lg cursor-pointer">
                  Import
                  <input
                    type="file"
                    hidden
                    accept=".xlsx"
                    onChange={handleImport}
                  />
                </label>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm border rounded-lg"
                >
                  Export
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm cursor-pointer bg-[#2D8A4E] text-white rounded-lg"
                >
                  + Add new
                </button>
              </div>
            </div>

            {/* TABLES */}
            {activeTab === 'sales' ? (
  <table className="w-full text-sm">
    <thead className="border-b text-gray-500">
      <tr>
        <th className="py-3 text-left">Client</th>
        <th>Date</th>
        <th>Contact No</th>
        <th>Sales Rep</th>
        <th>Product</th>
        <th>Company</th>
        <th>Amount</th>
        <th>Remark</th>
      </tr>
    </thead>

    <tbody>
      {sales.map(row => (
        <tr key={row.id} className="border-b last:border-none">
          <td className="py-3 font-medium">{row.client}</td>
          <td>{row.date}</td>
          <td>{row.contactNo}</td>
          <td>{row.salesRep}</td>
          <td>{row.product}</td>
          <td>{row.company}</td>
          <td>{row.amount}</td>
          <td>{row.remark}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (

              <table className="w-full text-sm">
  <thead className="border-b text-gray-500">
    <tr>
      <th className="py-3 text-left">Client</th>
      <th>Date</th>
      <th>Contact No</th>
      <th>Discussion Summary</th>
      <th>Call Status</th>
      <th>Follow-up Date</th>
      <th>Follow-up Time</th>
    </tr>
  </thead>

  <tbody>
    {interactions.map(row => (
      <tr key={row.id} className="border-b last:border-none">
        <td className="py-3 font-medium">{row.client}</td>
        <td>{row.date}</td>
        <td>{row.contactNo}</td>
        <td>{row.summary}</td>
        <td>{row.callStatus}</td>
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

      {/* ✅ MODALS — THIS IS THE CORRECT PLACE */}
      {activeTab === 'sales' ? (
        <AddSalesModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
        />
      ) : (
        <AddInteractionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}
