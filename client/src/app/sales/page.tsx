"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AddSalesModal from "@/components/AddSalesModal";

interface Assignee {
  name: string;
  avatar: string;
}

interface Client {
  id: string;
  name: string;
  date: string;
  spentTime: string;
  assignee: Assignee;
  priority: string;
  status: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  label: string;
}

const SalesPage = () => {
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("insurance");
  const [salesFromDB, setSalesFromDB] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hardcoded categories as they are static UI elements
  const categories: Category[] = [
    { id: "insurance", name: "Insurance", label: "Category" },
    { id: "mutualfunds", name: "Mutual Funds", label: "Category" },
    { id: "equity", name: "Equity", label: "Category" },
  ];

  /* ================= FETCH SALES FROM DJANGO ================= */
  useEffect(() => {
    if (!token) return;

    const fetchSales = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch("http://127.0.0.1:8000/api/sales/", { headers });
        if (!res.ok) throw new Error("Failed to fetch sales");

        const apiData = await res.json();

        const mappedData: Client[] = apiData.map((sale: any) => ({
          id: String(sale.id),
          name: sale.client?.name ?? "Unknown Client",
          date: sale.date,
          spentTime:
            sale.frequency === "M"
              ? "Monthly"
              : sale.frequency === "Q"
                ? "Quarterly"
                : sale.frequency === "Y"
                  ? "Yearly"
                  : "--",

          assignee: {
            name: sale.sales_rep?.name ?? "N/A",
            avatar: sale.sales_rep?.avatar ?? "/avatar.png",
          },
          priority: "Medium", // not in model → safe default
          status: "In Progress", // not in model → safe default
          category: (sale.product === "HI" || sale.product === "LI" || sale.product === "GI") ? "insurance" : "mutualfunds",
        }));

        setSalesFromDB(mappedData);
      } catch (err) {
        console.error("Sales API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [token]);

  const handleSaveSale = async (formData: any) => {
    try {
      const payload = {
        // Backend creates client by name
        client_name: formData.client,
        contactNo: formData.contactNo,

        // Sale model required fields
        sales_rep: (() => {
          const repId = parseInt(formData.employeeId);
          return isNaN(repId) ? 1 : repId; // fallback to ID 1 if invalid
        })(),

        date: formData.date,
        product: "HI", // Health Insurance
        company: formData.company,
        scheme: formData.company + " Scheme", // auto-generate
        amount: parseFloat(formData.amount) || 0,
        frequency: "M", // Monthly
        remarks: formData.remark || "",
      };

      console.log("Final payload to Django:", payload);

      const res = await fetch("http://127.0.0.1:8000/api/sales/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();

        if (errorText.includes("sales_rep")) {
          alert("Employee ID not found. Use ID 1 or check /admin/employees");
        } else if (errorText.includes("client")) {
          alert("Client issue. Check client name");
        } else {
          alert("Server error: " + errorText);
        }
        return;
      }

      const newSale = await res.json();

      // Your exact mapping logic
      const mappedSale: Client = {
        id: String(newSale.id),
        name: newSale.client.name,
        date: newSale.date,
        spentTime:
          newSale.frequency === "M"
            ? "Monthly"
            : newSale.frequency === "Q"
              ? "Quarterly"
              : "Yearly",
        assignee: {
          name: newSale.sales_rep.name,
          avatar: newSale.sales_rep.avatar || "/avatar.png",
        },
        priority: "Medium",
        status: "In Progress",
        category: newSale.product === "HI" ? "insurance" : "mutualfunds",
      };

      setSalesFromDB((prev) => [mappedSale, ...prev]);
    } catch (error: any) {
      console.error("Error:", error.message);
      alert("Failed: " + error.message);
    }
  };

  /* ================= DB DATA ONLY ================= */
  const clientsToShow = salesFromDB;

  const filteredClients = clientsToShow.filter(
    (client) => client.category === selectedCategory
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "to do":
        return "bg-gray-100 text-gray-700";
      case "in review":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden ml-64 mt-16 p-6">
        <main className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#00337C]">Sales</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#2D8A4E] hover:bg-[#236b3d] transition-colors text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
            >
              <span className="text-lg">+</span>
              Add Sales
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* LEFT PANEL */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Current Sales
                </h2>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`cursor-pointer p-3 rounded-lg transition ${selectedCategory === category.id
                        ? "bg-[#00337C]/11 border-l-4 border-[#00337C]"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {category.label}
                      </p>
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Sales Overview
                </h2>

                <div className="bg-[#F4F9FD] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    All Sales
                  </h3>

                  {loading && (
                    <p className="text-sm text-gray-500">Loading sales...</p>
                  )}

                  {!loading && filteredClients.length === 0 && (
                    <p className="text-sm text-gray-500">No sales found.</p>
                  )}

                  <div className="space-y-3">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white p-4 rounded-lg flex items-center justify-between hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Name</p>
                          <p className="font-medium text-gray-900">
                            {client.name}
                          </p>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Date</p>
                          <p className="text-sm text-gray-700">{client.date}</p>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            Frequency
                          </p>
                          <p className="text-sm text-gray-700">
                            {client.spentTime}
                          </p>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            Assignee
                          </p>
                          <img
                            src={client.assignee.avatar}
                            alt={client.assignee.name}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddSalesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveSale}
      />
    </div>
  );
};

export default SalesPage;

