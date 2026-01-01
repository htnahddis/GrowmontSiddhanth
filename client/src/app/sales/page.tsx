"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import data from "@/data/data.json";

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

interface Task {
  id: string;
  name: string;
  estimate: string;
  spentTime: string;
  assignee: Assignee;
  priority: string;
}

interface Category {
  id: string;
  name: string;
  label: string;
}

const SalesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("insurance");

  const categories = data.categories as Category[];
  const clients = data.clients as Client[];
  const tasks = data.tasks as Task[];

  const filteredClients = clients.filter(
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

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "medium":
        return "↑";
      case "low":
        return "↓";
      default:
        return "";
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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <span className="text-lg">+</span>
              Add Sales
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Categories */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Current Sales</h2>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`cursor-pointer p-3 rounded-lg transition ${
                        selectedCategory === category.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {category.label}
                      </p>
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                      {selectedCategory === category.id && (
                        <button className="text-blue-600 text-sm mt-2 flex items-center gap-1 hover:underline">
                          View details
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Sales Overview */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sales Overview
                  </h2>
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    All Sales
                  </h3>
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
                            Spent Time
                          </p>
                          <p className="text-sm text-gray-700">
                            {client.spentTime}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Assignee</p>
                          <img
                            src={client.assignee.avatar}
                            alt={client.assignee.name}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Priority</p>
                          <p
                            className={`text-sm font-medium flex items-center gap-1 ${getPriorityColor(
                              client.priority
                            )}`}
                          >
                            {getPriorityIcon(client.priority)} {client.priority}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status}
                          </span>
                          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="space-y-3 mt-6">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-200 hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Task Name</p>
                        <p className="font-medium text-gray-900">{task.name}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Estimate</p>
                        <p className="text-sm text-gray-700">{task.estimate}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Spent Time</p>
                        <p className="text-sm text-gray-700">{task.spentTime}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Assignee</p>
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Priority</p>
                        <p
                          className={`text-sm font-medium flex items-center gap-1 ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityIcon(task.priority)} {task.priority}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-4 border-gray-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesPage;