"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AddReminderModal from "@/components/AddReminderModal";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  birthday: string;
  email: string;
  mobile: string;
  avatar: string;
}

interface Client {
  id: string;
  name: string;
  category: string;
  level: string;
  avatar: string;
}

interface ProductSale {
  id: string;
  productId: string;
  clientName: string;
  createdDate: string;
  priority: string;
  category: string;
  amount: number;
  categoryCount: number;
  representatives: string[];
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  priority: string;
  icon: string;
  color: string;
}

type TabType = "clients" | "productSales" | "reminders";

const ProfilePage = () => {
  const { user: authUser, isLoading } = useAuth();
  const router = useRouter();


  const [activeTab, setActiveTab] = useState<TabType>("reminders");
  const [openReminder, setOpenReminder] = useState(false);

  // State
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/login');
    }
  }, [isLoading, authUser, router]);

  useEffect(() => {
    if (!authUser) return;

    const fetchProfileData = async () => {
      try {
        const userId = authUser.id; // Use logged-in user ID

        // 1. Fetch User Data
        const userRes = await fetch(`http://127.0.0.1:8000/api/employees/${userId}/`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({
            id: String(userData.id),
            name: userData.name,
            birthday: userData.dob,
            email: userData.email,
            mobile: userData.mobile_no,
            avatar: userData.avatar || "/avatar.png",
          });
        }

        // 2. Fetch Clients
        const clientsRes = await fetch(`http://127.0.0.1:8000/api/employees/${userId}/clients/`);
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            category: "Insurance", // Mock
            level: "High", // Mock
            avatar: "/avatar.png" // Mock
          })));
        }

        // 3. Fetch Sales
        const salesRes = await fetch(`http://127.0.0.1:8000/api/employees/${userId}/sales/`);
        if (salesRes.ok) {
          const salesData = await salesRes.json();
          setProductSales(salesData.map((s: any) => ({
            id: String(s.id),
            productId: s.product,
            clientName: s.client?.name || "Unknown",
            createdDate: s.date,
            priority: "High", // Mock
            category: s.product === 'MF' ? "Mutual Funds" : "Insurance",
            amount: parseFloat(s.amount),
            categoryCount: 1,
            representatives: [s.sales_rep?.avatar || "/avatar.png"]
          })));
        }

        // 4. Fetch Reminders (Interactions)
        // We'll fetch all interactions for this employee
        // Since there is no specific endpoint for employee interactions in the list provided,
        // we might have to fetch all and filter, OR (better) assume interactions are reminders.
        // Let's try fetching all interactions and filtering by employee in frontend if needed,
        // or just showing recent interactions.
        const interactionRes = await fetch(`http://127.0.0.1:8000/api/interactions/`);
        if (interactionRes.ok) {
          const intData = await interactionRes.json();
          // Filter for this employee if backend sends employee field
          const myInteractions = intData.filter((i: any) => i.employee?.id === userId);

          setReminders(myInteractions.map((i: any) => ({
            id: String(i.id),
            title: i.discussion_notes.substring(0, 30) + "...",
            date: i.date,
            time: "10:00 AM", // Mock
            duration: "30m", // Mock
            priority: "Medium",
            icon: "call", // Mock
            color: "blue" // Mock
          })));
        }

      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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

  const getReminderBorderColor = (color: string) => {
    switch (color) {
      case "blue":
        return "border-l-4 border-blue-500";
      case "yellow":
        return "border-l-4 border-yellow-500";
      case "green":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  const getReminderIconBg = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64 mt-16 p-6">
        <main className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <div className="flex items-center gap-3">
              {/* Add buttons and Modal removed as per requirement */}
              {/* Settings icon next to Add buttons removed */}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - User Info */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Profile Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full border-4 border-blue-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {user.name}
                      </h2>
                      {/* Position removed */}
                    </div>
                  </div>
                  {/* Settings icon removed */}
                </div>

                {/* Main Info */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Main info
                  </h3>
                  <div className="space-y-4">
                    {/* Position, Department, Location removed */}
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Birthday Date
                      </label>
                      <div className="relative">
                        <input
                          readOnly
                          type="text"
                          value={user.birthday}
                          placeholder=""
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                        />
                        <svg
                          className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={user.mobile}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                      />
                    </div>
                    {/* Skype removed */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Tabs Content */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setActiveTab("productSales")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === "productSales"
                      ? "bg-[#2D8A4E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    Product Sales
                  </button>
                  <button
                    onClick={() => setActiveTab("clients")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === "clients"
                      ? "bg-[#2D8A4E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setActiveTab("reminders")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === "reminders"
                      ? "bg-[#2D8A4E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    Reminders
                  </button>
                </div>

                {/* Clients Tab */}
                {activeTab === "clients" && (
                  <div className="grid grid-cols-4 gap-4">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
                      >
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-16 h-16 rounded-full mx-auto mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {client.category}
                        </p>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300">
                          {client.level}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Sales Tab */}
                {activeTab === "productSales" && (
                  <div className="space-y-4">
                    {productSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg"></div>
                            <div>
                              <p className="text-xs text-gray-500">
                                {sale.productId}
                              </p>
                              <p className="font-semibold text-gray-900">
                                {sale.clientName}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">
                            Created {sale.createdDate}
                          </p>
                        </div>

                        <p
                          className={`text-sm font-medium flex items-center gap-1 ${getPriorityColor(
                            sale.priority
                          )}`}
                        >
                          ↑ {sale.priority}
                        </p>

                        <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[250px]">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            {sale.category}
                          </h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-semibold text-gray-900">
                                {sale.amount}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Category</p>
                              <p className="font-semibold text-gray-900">
                                {sale.categoryCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Representativ
                              </p>
                              <div className="flex -space-x-2">
                                {sale.representatives.map((rep, idx) => (
                                  <img
                                    key={idx}
                                    src={rep}
                                    alt=""
                                    className="w-6 h-6 rounded-full border-2 border-white"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reminders Tab */}
                {activeTab === "reminders" && (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`bg-white rounded-lg p-4 hover:shadow-md transition flex items-center justify-between ${getReminderBorderColor(
                          reminder.color
                        )}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getReminderIconBg(
                              reminder.color
                            )}`}
                          >
                            {reminder.icon === "document" ? (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {reminder.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {reminder.date} | {reminder.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-yellow-500 text-2xl">↑</span>
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm text-gray-700">
                              {reminder.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6 max-w-2xl">
            <h2 className="text-xl font-bold text-[#00337C] mb-6">Change Password</h2>
            <ChangePasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
};

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useAuth(); // Need token to call API

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/password/change/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      {message && <div className="text-green-600 bg-green-50 p-3 rounded text-sm">{message}</div>}
      {error && <div className="text-red-600 bg-red-50 p-3 rounded text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-[#00337C] text-white px-6 py-2 rounded-lg hover:bg-[#00265c] transition-colors"
      >
        Update Password
      </button>
    </form>
  );
}

export default ProfilePage;