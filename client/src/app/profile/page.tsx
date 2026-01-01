"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import profileData from "@/data/profileData.json";
import AddReminderModal from "@/components/AddReminderModal";

interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  location: string;
  birthday: string;
  email: string;
  mobile: string;
  skype: string;
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
  const [activeTab, setActiveTab] = useState<TabType>("reminders");
  const [openReminder, setOpenReminder] = useState(false);


  const user = profileData.user as User;
  const clients = profileData.clients as Client[];
  const productSales = profileData.productSales as ProductSale[];
  const reminders = profileData.reminders as Reminder[];

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

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
        <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64 mt-16 p-6">
        <main className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <div className="flex items-center gap-3">
              {activeTab === "productSales" && (
                <button className="bg-[#2D8A4E] hover:bg-[#236b3d] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                  <span className="text-lg">+</span>
                  Add Sales
                </button>
              )}
              {activeTab === "clients" && (
                <button className="bg-[#2D8A4E] hover:bg-[#236b3d] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                  <span className="text-lg">+</span>
                  Add Interactions
                </button>
              )}
              {activeTab === "reminders" && (
                <button className="bg-[#2D8A4E] hover:bg-[#236b3d] cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                onClick={() => setOpenReminder(true)}>
                  <span className="text-lg">+</span>
                  Add Reminder
                </button>

    
              )}

               <AddReminderModal
        isOpen={openReminder}
        onClose={() => setOpenReminder(false)}
      />
              <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
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
                      <p className="text-sm text-gray-600">{user.position}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Main Info */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Main info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Position
                      </label>
                      <input
                        type="text"
                        value={user.position}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Department
                      </label>
                      <input
                        type="text"
                        value={user.department}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user.location}
                          readOnly
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Birthday Date
                      </label>
                      <div className="relative">
                        <input
                        readOnly
                          type="text"
                          value=""
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
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Skype
                      </label>
                      <input
                        type="text"
                        value={user.skype}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
                      />
                    </div>
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
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === "productSales"
                        ? "bg-[#2D8A4E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Product Sales
                  </button>
                  <button
                    onClick={() => setActiveTab("clients")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === "clients"
                        ? "bg-[#2D8A4E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setActiveTab("reminders")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === "reminders"
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;