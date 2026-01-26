'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import data from '@/data/infoPortalData.json';
import toast from 'react-hot-toast';

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
  const [activeTab, setActiveTab] =useState<'sales' | 'interactions'>('interactions');

  const [sales, setSales] = useState<SalesRow[]>(data.sales);
  const [interactions, setInteractions] =useState<InteractionRow[]>(data.interactions);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    client: '',
    salesRep: '', // for sales only
    product: '', // for sales only
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredSales = sales.filter(s =>{
  const matchesSearch = s.client.toLowerCase().includes(search.toLowerCase());
  const matchesDateFrom = !filters.dateFrom || s.date >= filters.dateFrom;
  const matchesDateTo = !filters.dateTo || s.date <= filters.dateTo;
  const matchesClient = !filters.client || s.client.toLowerCase().includes(filters.client.toLowerCase());
  const matchesSalesRep = !filters.salesRep || s.salesRep.toLowerCase().includes(filters.salesRep.toLowerCase());
  const matchesProduct = !filters.product || s.product === filters.product;
  
  return matchesSearch && matchesDateFrom && matchesDateTo && matchesClient && matchesSalesRep && matchesProduct;
});

const filteredInteractions = interactions.filter(i => {
  const matchesSearch = i.client.toLowerCase().includes(search.toLowerCase());
  const matchesDateFrom = !filters.dateFrom || i.date >= filters.dateFrom;
  const matchesDateTo = !filters.dateTo || i.date <= filters.dateTo;
  const matchesClient = !filters.client || i.client.toLowerCase().includes(filters.client.toLowerCase());
  
  return matchesSearch && matchesDateFrom && matchesDateTo && matchesClient;
});

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

  const handleBulkDelete= async()=>{
    if (selectedRows.length === 0) {
    toast.error('No rows selected');
    return;
  }

  if (!confirm(`Delete ${selectedRows.length} item(s)?`)) return;

  const promises = selectedRows.map(id => handleDelete(id));
  await Promise.all(promises);
  setSelectedRows([]);
};

// Add toggle function for row selection
const toggleRowSelection = (id: number) => {
  setSelectedRows(prev =>
    prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
  );
};

// Add select all function
const toggleSelectAll = () => {
  const currentData = activeTab === 'sales' ? filteredSales : filteredInteractions;
  if (selectedRows.length === currentData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(currentData.map(row => row.id));
  }
};

// Reset filters function
const resetFilters = () => {
  setFilters({
    dateFrom: '',
    dateTo: '',
    client: '',
    salesRep: '',
    product: '',
  });
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
                <button 
                  onClick={handleBulkDelete} disabled={selectedRows.length===0}
                  className={`px-4 py-2 text-sm border rounded-lg ${selectedRows.length>0 ? 'hover:bg-red-50 hover:border-red-300' : 'opacity-50 cursor-not-allowed'}`}>
                  Delete {selectedRows.length>0 && `(${selectedRows.length})`}
                </button>

                <button 
                  onClick={()=> setShowFilters(!showFilters)}
                  className={`px-4 py-2 text-sm border rounded-lg ${showFilters? 'bg-gray-100' : ''}`}>
                  Filters
                </button>

                <label className="px-4 py-2 text-sm border rounded-lg cursor-pointer hover:bg-gray-50">
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
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Export
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm cursor-pointer bg-[#2D8A4E] text-white rounded-lg hover:bg-[#246b3d]"
                >
                  + Add new
                </button>
              </div>
            </div>

            {/* FILTERS PANEL */}
{showFilters && (
  <div className="my-4 p-4 bg-white rounded-lg border">
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Date From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Date To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Client Name</label>
        <input
          type="text"
          value={filters.client}
          onChange={(e) => setFilters({ ...filters, client: e.target.value })}
          placeholder="Search client..."
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      
      {activeTab === 'sales' && (
        <div>
          <label className="block text-sm font-medium mb-1">Sales Rep</label>
          <input
            type="text"
            value={filters.salesRep}
            onChange={(e) => setFilters({ ...filters, salesRep: e.target.value })}
            placeholder="Search sales rep..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      )}
    </div>
    
    <div className="mt-3 flex gap-2">
      <button
        onClick={resetFilters}
        className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Reset Filters
      </button>
      <span className="text-sm text-gray-600 py-2">
        Showing {activeTab === 'sales' ? filteredSales.length : filteredInteractions.length} results
      </span>
    </div>
  </div>
)}


            {/* TABLES */}
{activeTab === 'sales' ? (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="py-3 px-4 text-left">
            <input
              type="checkbox"
              checked={selectedRows.length === filteredSales.length && filteredSales.length > 0}
              onChange={toggleSelectAll}
              className="rounded"
            />
          </th>
          <th className="py-3 px-4 text-left font-semibold text-gray-600">Client</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Date</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Contact No</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Sales Rep</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Product</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Company</th>
          <th className="py-3 px-4 text-right font-semibold text-gray-600">Amount</th>
          <th className="py-3 px-4 text-left font-semibold text-gray-600">Remark</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredSales.map(row => (
          <tr key={row.id} className="border-b last:border-none hover:bg-gray-50">
            <td className="py-3 px-4">
              <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={() => toggleRowSelection(row.id)}
                className="rounded"
              />
            </td>
            <td className="py-3 px-4 font-medium">{row.client}</td>
            <td className="py-3 px-4 text-center">{row.date}</td>
            <td className="py-3 px-4 text-center">{row.contactNo}</td>
            <td className="py-3 px-4 text-center">{row.salesRep}</td>
            <td className="py-3 px-4 text-center">{row.product}</td>
            <td className="py-3 px-4 text-center">{row.company}</td>
            <td className="py-3 px-4 text-right font-semibold">{row.amount}</td>
            <td className="py-3 px-4 text-left">{row.remark}</td>
            <td className="py-3 px-4 text-center">
              <button
                onClick={() => handleDelete(row.id)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
<div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="py-3 px-4 text-left">
            <input
              type="checkbox"
              checked={selectedRows.length === filteredInteractions.length && filteredInteractions.length > 0}
              onChange={toggleSelectAll}
              className="rounded"
            />
          </th>
          <th className="py-3 px-4 text-left font-semibold text-gray-600">Client</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Date</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Contact No</th>
          <th className="py-3 px-4 text-left font-semibold text-gray-600">Discussion Summary</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Call Status</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Follow-up Date</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Follow-up Time</th>
          <th className="py-3 px-4 text-center font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredInteractions.map(row => (
          <tr key={row.id} className="border-b last:border-none hover:bg-gray-50">
            <td className="py-3 px-4">
              <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={() => toggleRowSelection(row.id)}
                className="rounded"
              />
            </td>
            <td className="py-3 px-4 font-medium">{row.client}</td>
            <td className="py-3 px-4 text-center">{row.date}</td>
            <td className="py-3 px-4 text-center">{row.contactNo}</td>
            <td className="py-3 px-4 text-left">{row.summary}</td>
            <td className="py-3 px-4 text-center">{row.callStatus}</td>
            <td className="py-3 px-4 text-center">{row.followUpDate}</td>
            <td className="py-3 px-4 text-center">{row.followUpTime}</td>
            <td className="py-3 px-4 text-center">
              <button
                onClick={() => handleDelete(row.id)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}          </div>
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
