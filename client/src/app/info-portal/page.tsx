'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { Trash2, Edit } from 'lucide-react';
import AddSalesModal from '@/components/AddSalesModal';
import AddInteractionModal from '@/components/AddInteractionsModal';

type SalesRow = {
  id: number;
  client_name: string;
  date: string;
  sales_rep_name: string;
  sales_rep_id: number;
  product: string;
  product_display: string;
  frequency: string;
  frequency_display: string;
  company: string;
  scheme: string;
  amount: string;
  remarks: string;
};

type InteractionRow = {
  id: number;
  client_name: string;
  client_contact: string;
  date: string;
  employee_name: string;
  employee_id: number;
  discussion_notes: string;
  priority: string;
  priority_display: string;
  follow_up_date: string;
  follow_up_time: string;
};

export default function InfoPortalPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'sales' | 'interactions'>('interactions');

  const [sales, setSales] = useState<SalesRow[]>([]);
  const [interactions, setInteractions] = useState<InteractionRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    client: '',
    salesRep: '',
    product: '',
    priority: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [editingRow, setEditingRow] = useState<SalesRow | InteractionRow | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Product options for dropdown
  const productOptions = [
    { value: '', label: 'All Products' },
    { value: 'MF', label: 'Mutual Funds' },
    { value: 'HI', label: 'Health Insurance' },
    { value: 'GI', label: 'General Insurance' },
    { value: 'LI', label: 'Life Insurance' },
    { value: 'NCD', label: 'NCDs' },
    { value: 'MLD', label: 'MLDs' },
    { value: 'BOND', label: 'Bonds' },
    { value: 'CFD', label: 'Corporate FDs' },
    { value: 'AIF', label: 'AIFs' },
    { value: 'PMS', label: 'PMS' },
    { value: 'ADV', label: 'Advisory' },
    { value: 'SB', label: 'Shares Broking' },
    { value: 'US', label: 'Unlisted Shares' },
    { value: 'RE', label: 'Real Estate' },
    { value: 'LOAN', label: 'Loans' },
    { value: 'WILL', label: 'Will Making' },
  ];

  // Priority options for dropdown
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.client_name.toLowerCase().includes(search.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || s.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || s.date <= filters.dateTo;
    const matchesClient = !filters.client || s.client_name.toLowerCase().includes(filters.client.toLowerCase());
    const matchesSalesRep = !filters.salesRep || s.sales_rep_name.toLowerCase().includes(filters.salesRep.toLowerCase());
    const matchesProduct = !filters.product || s.product === filters.product;

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesClient && matchesSalesRep && matchesProduct;
  });

  const filteredInteractions = interactions.filter(i => {
    const matchesSearch = i.client_name.toLowerCase().includes(search.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || i.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || i.date <= filters.dateTo;
    const matchesClient = !filters.client || i.client_name.toLowerCase().includes(filters.client.toLowerCase());
    const matchesPriority = !filters.priority || i.priority === filters.priority;

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesClient && matchesPriority;
  });

  /* ================= FETCH FROM DB ================= */

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    // Fetch Sales
    fetch('http://127.0.0.1:8000/api/sales/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/';
          return [];
        }
        return res.ok ? res.json() : [];
      })
      .then(dbSales => {
        if (dbSales.length) {
          setSales(
            dbSales.map((s: any) => ({
              id: s.id,
              client_name: s.client_name || 'Unknown',
              date: s.date,
              sales_rep_name: s.sales_rep_name || 'Unassigned',
              sales_rep_id: s.sales_rep_id,
              product: s.product,
              product_display: s.product_display,
              frequency: s.frequency,
              frequency_display: s.frequency_display,
              company: s.company,
              scheme: s.scheme,
              amount: s.amount,
              remarks: s.remarks || '',
            }))
          );
        }
      })
      .catch(err => {
        console.error('Failed to fetch sales:', err);
        toast.error('Failed to load sales');
      });

    // Fetch Interactions
    fetch('http://127.0.0.1:8000/api/interactions/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/';
          return [];
        }
        return res.ok ? res.json() : [];
      })
      .then(dbInteractions => {
        if (dbInteractions.length) {
          setInteractions(
            dbInteractions.map((i: any) => ({
              id: i.id,
              client_name: i.client_name || 'Unknown',
              client_contact: i.client_contact || '',
              date: i.date,
              employee_name: i.employee_name || 'Unassigned',
              employee_id: i.employee_id,
              discussion_notes: i.discussion_notes || '',
              priority: i.priority,
              priority_display: i.priority_display,
              follow_up_date: i.follow_up_date,
              follow_up_time: i.follow_up_time,
            }))
          );
        }
      })
      .catch(err => {
        console.error('Failed to fetch interactions:', err);
        toast.error('Failed to load interactions');
      });
  }, []);

  /* ================= EXPORT ================= */

  const handleExport = async () => {
    const dataToExport = activeTab === 'sales' ? filteredSales : filteredInteractions;

    if (dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    const exportPayload = {
      data: dataToExport.map(row => {
        if (activeTab === 'sales') {
          const salesRow = row as SalesRow;
          return {
            client_name: salesRow.client_name,
            date: salesRow.date,
            sales_rep: salesRow.sales_rep_name,
            product: salesRow.product_display,
            company: salesRow.company,
            scheme: salesRow.scheme,
            amount: salesRow.amount,
            frequency: salesRow.frequency_display,
            remarks: salesRow.remarks,
          };
        } else {
          const interactionRow = row as InteractionRow;
          return {
            client_name: interactionRow.client_name,
            client_contact: interactionRow.client_contact,
            date: interactionRow.date,
            employee: interactionRow.employee_name,
            discussion_notes: interactionRow.discussion_notes,
            priority: interactionRow.priority_display,
            follow_up_date: interactionRow.follow_up_date,
            follow_up_time: interactionRow.follow_up_time,
          };
        }
      }),
    };

    const url =
      activeTab === 'sales'
        ? 'http://127.0.0.1:8000/api/export/sales/filtered/'
        : 'http://127.0.0.1:8000/api/export/interactions/filtered/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportPayload),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = activeTab === 'sales' ? 'filtered_sales.xlsx' : 'filtered_interactions.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Exported ${dataToExport.length} ${activeTab === 'sales' ? 'sales' : 'interactions'}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
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

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Imported successfully!');
        window.location.reload();
      } else {
        toast.error('Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    }
  };

  /* ================= ADD ================= */

  const handleAdd = async (payload: any) => {
    const url =
      activeTab === 'sales'
        ? 'http://127.0.0.1:8000/api/sales/create/'
        : 'http://127.0.0.1:8000/api/interactions/create/';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('Added successfully');
      setShowModal(false);
      window.location.reload();
    } else {
      const errorData = await res.json();
      console.error('Add error:', errorData);
      toast.error('Failed to add');
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = async (payload: any) => {
    if (!editingRow) return;

    const url =
      activeTab === 'sales'
        ? `http://127.0.0.1:8000/api/sales/${editingRow.id}/update/`
        : `http://127.0.0.1:8000/api/interactions/${editingRow.id}/update/`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('Updated successfully');
      setShowEditModal(false);
      setEditingRow(null);
      window.location.reload();
    } else {
      const errorData = await res.json();
      console.error('Update error:', errorData);
      toast.error('Failed to update');
    }
  };

  const openEditModal = (row: SalesRow | InteractionRow) => {
    setEditingRow(row);
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    const url =
      activeTab === 'sales'
        ? `http://127.0.0.1:8000/api/sales/${id}/delete/`
        : `http://127.0.0.1:8000/api/interactions/${id}/delete/`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });

    if (res.ok) {
      toast.success('Deleted');
      if (activeTab === 'sales') {
        setSales(prev => prev.filter(r => r.id !== id));
      } else {
        setInteractions(prev => prev.filter(r => r.id !== id));
      }
    } else {
      toast.error('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('No rows selected');
      return;
    }

    if (!confirm(`Delete ${selectedRows.length} item(s)?`)) return;

    const promises = selectedRows.map(id => handleDelete(id));
    await Promise.all(promises);
    setSelectedRows([]);
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentData = activeTab === 'sales' ? filteredSales : filteredInteractions;
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map(row => row.id));
    }
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      client: '',
      salesRep: '',
      product: '',
      priority: '',
    });
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  return (
    <div className="bg-[#F6FAFD] min-h-screen">
      <Sidebar />
      <Navbar />

      <div className="ml-64 mt-16">
        <div className="p-6">
          {/* HEADER & TABS */}
          <div className="flex bg-gray-200 rounded-3xl p-1 w-fit mb-6">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-2 rounded-3xl font-medium transition-colors ${activeTab === 'sales'
                  ? 'bg-[#2D8A4E] text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Sales
            </button>

            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-6 py-2 rounded-3xl font-medium transition-colors ${activeTab === 'interactions'
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
                  Manage and track all {activeTab === 'sales' ? 'sales' : 'interactions'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedRows.length === 0}
                  className={`px-4 py-2 text-sm border rounded-lg ${selectedRows.length > 0 ? 'hover:bg-red-50 hover:border-red-300' : 'opacity-50 cursor-not-allowed'
                    }`}>
                  Delete {selectedRows.length > 0 && `(${selectedRows.length})`}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 text-sm border rounded-lg ${showFilters ? 'bg-gray-100' : ''}`}>
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
                  Export ({activeTab === 'sales' ? filteredSales.length : filteredInteractions.length})
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
              <div className="my-4 p-4 bg-gray-50 rounded-lg border">
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

                  {activeTab === 'sales' ? (
                    <>
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
                      <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <select
                          value={filters.product}
                          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          {productOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        {priorityOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
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
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Sales Rep</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Product</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Company</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Scheme</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-600">Amount</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Frequency</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSales.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-gray-500">
                          No sales found
                        </td>
                      </tr>
                    ) : (
                      filteredSales.map(row => (
                        <tr key={row.id} className="border-b last:border-none hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(row.id)}
                              onChange={() => toggleRowSelection(row.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{row.client_name}</td>
                          <td className="py-3 px-4 text-center">{row.date}</td>
                          <td className="py-3 px-4 text-center">{row.sales_rep_name}</td>
                          <td className="py-3 px-4 text-center">{row.product_display}</td>
                          <td className="py-3 px-4 text-center">{row.company}</td>
                          <td className="py-3 px-4 text-center">{row.scheme}</td>
                          <td className="py-3 px-4 text-right font-semibold">{formatAmount(row.amount)}</td>
                          <td className="py-3 px-4 text-center">{row.frequency_display}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Contact</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Date</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Representative</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Discussion Notes</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Priority</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Follow-up Date</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Follow-up Time</th>
                      <th className="py-3 px-4 text-center font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInteractions.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-gray-500">
                          No interactions found
                        </td>
                      </tr>
                    ) : (
                      filteredInteractions.map(row => (
                        <tr key={row.id} className="border-b last:border-none hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(row.id)}
                              onChange={() => toggleRowSelection(row.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{row.client_name}</td>
                          <td className="py-3 px-4 text-center">{row.client_contact}</td>
                          <td className="py-3 px-4 text-center">{row.date}</td>
                          <td className="py-3 px-4 text-center">{row.employee_name}</td>
                          <td className="py-3 px-4 text-left max-w-xs truncate">{row.discussion_notes}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                row.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                              }`}>
                              {row.priority_display}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">{row.follow_up_date}</td>
                          <td className="py-3 px-4 text-center">{row.follow_up_time}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeTab === 'sales' ? (
        <>
          <AddSalesModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={(payload: any) => handleAdd(payload)}
          />
          {editingRow && (
            <AddSalesModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingRow(null);
              }}
              onSave={(payload: any) => handleEdit(payload)}
              initialData={{
                id: (editingRow as SalesRow).id,
                date: (editingRow as SalesRow).date,
                client_name: (editingRow as SalesRow).client_name,
                sales_rep: (editingRow as SalesRow).sales_rep_id,
                product: (editingRow as SalesRow).product,
                company: (editingRow as SalesRow).company,
                scheme: (editingRow as SalesRow).scheme,
                amount: (editingRow as SalesRow).amount,
                frequency: (editingRow as SalesRow).frequency,
                remarks: (editingRow as SalesRow).remarks,
              }}
            />
          )}
        </>
      ) : (
        <>
          <AddInteractionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={(payload: any) => handleAdd(payload)}
          />
          {editingRow && (
            <AddInteractionModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingRow(null);
              }}
              onSave={(payload: any) => handleEdit(payload)}
              initialData={{
                id: (editingRow as InteractionRow).id,
                date: (editingRow as InteractionRow).date,
                client_name: (editingRow as InteractionRow).client_name,
                client_contact: (editingRow as InteractionRow).client_contact,
                employee: (editingRow as InteractionRow).employee_id,
                discussion_notes: (editingRow as InteractionRow).discussion_notes,
                priority: (editingRow as InteractionRow).priority,
                follow_up_date: (editingRow as InteractionRow).follow_up_date,
                follow_up_time: (editingRow as InteractionRow).follow_up_time,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}