// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import Sidebar from '@/components/Sidebar';
// import Navbar from '@/components/Navbar';
// import Reminders from '@/components/Remiander';
// import { Employee, Reminder, ProductSale } from '@/types';

// const DashboardPage: React.FC = () => {

//   /* REMOVED: const router = useRouter() */
//   const { token, isLoading } = useAuth(); // Get token
//   const router = useRouter();

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [reminders, setReminders] = useState<Reminder[]>([]);
//   const [products, setProducts] = useState<ProductSale[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Protect route
//   useEffect(() => {
//     if (!isLoading && !token) {
//       router.push('/login');
//     }
//   }, [isLoading, token, router]);

//   useEffect(() => {
//     if (!token) return;

//     const fetchData = async () => {
//       try {
//         const headers = { 'Authorization': `Bearer ${token}` };

//         // Fetch Employees
//         const empRes = await fetch('http://127.0.0.1:8000/api/employees/', { headers });
//         const empData = await empRes.json();

//         // Map Employees (Backend to Frontend type)
//         const mappedEmployees: Employee[] = Array.isArray(empData) ? empData.map((e: any) => ({
//           id: String(e.id),
//           name: e.name,
//           department: "Sales", // Default
//           level: "Senior", // Default
//           position: "Sales Representative",
//           gender: e.gender,
//           birthday: e.dob,
//           fullAge: 30, // Default
//           avatar: e.avatar || "/avatar.png",
//           location: "New York",
//           mobile: e.mobile_no,
//           skype: e.email,
//           clients: e.clients_count,
//           interactions: e.interactions_count,
//           successRate: 85, // Default
//           clientsAvailable: "20/30",
//           interactionsAvailable: "15/20",
//           successRateAvailable: "85/100"
//         })) : [];
//         setEmployees(mappedEmployees);

//         // Fetch Sales (mapped to Products)
//         const salesRes = await fetch('http://127.0.0.1:8000/api/sales/', { headers });
//         const salesData = await salesRes.json();

//         const mappedProducts: ProductSale[] = Array.isArray(salesData) ? salesData.map((s: any) => ({
//           id: String(s.id),
//           clientName: s.client?.name || "Unknown",
//           type: s.product === 'MF' ? 'Mutual Funds' :
//             s.product === 'HI' ? 'Health Insurance' :
//               s.product === 'GI' ? 'General Insurance' : 'Life Insurance',
//           amount: parseFloat(s.amount),
//           category: 1, // Default number
//           createdDate: s.date,
//           priority: "Medium",
//           representatives: [s.sales_rep?.avatar || "/avatar.png"]
//         })) : [];
//         setProducts(mappedProducts);

//         // Fetch Interactions (mapped to Reminders)
//         const intRes = await fetch('http://127.0.0.1:8000/api/interactions/', { headers });
//         const intData = await intRes.json();

//         const mappedReminders: Reminder[] = Array.isArray(intData) ? intData.map((i: any) => ({
//           id: String(i.id),
//           title: `Follow up: ${i.client?.name}`,
//           datetime: i.next_follow_up, // Date string
//           type: 'call',
//           date: i.date?.split('T')[0] || '2023-01-01',
//           time: '10:00 AM', // Mock
//           duration: '30m', // Mock
//           status: 'upcoming'
//         })) : [];
//         setReminders(mappedReminders);

//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const getLevelColor = (level: string) => {
//     switch (level) {
//       case 'Junior':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'Middle':
//         return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'Senior':
//         return 'bg-green-100 text-green-700 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'High':
//         return 'text-red-500';
//       case 'Medium':
//         return 'text-orange-500';
//       case 'Low':
//         return 'text-green-500';
//       default:
//         return 'text-gray-500';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F4F9FD]">
//       <Sidebar />
//       <Navbar />

//       <main className="ml-64 mt-16 p-6">
//         <div className="flex gap-6">
//           <div className="flex-1">
//             <div className="mb-6">
//               <p className="text-gray-600 text-sm mb-1">Welcome back, Evan!</p>
//               <h1 className="text-3xl font-bold text-[#00337C]">Dashboard</h1>
//             </div>

//             {/* Employees Section */}
//             <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
//                 <Link href="/employees">
//                   <button className="text-sm text-[#3B5BA5] font-medium cursor-pointer">
//                     View all →
//                   </button>
//                 </Link>
//               </div>

//               <div className="grid grid-cols-3 gap-6">
//                 {employees.slice(0, 6).map((employee) => (
//                   <div key={employee.id} onClick={() => router.push(`/employees/${employee.id}`)}
//                     className="flex flex-col items-center bg-[#F4F9FD] py-5 px-2 rounded-3xl cursor-pointer">
//                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-3 flex items-center justify-center text-white text-xl font-semibold">
//                       {employee.name.split(' ').map(n => n[0]).join('')}
//                     </div>
//                     <h3 className="font-semibold text-gray-900 text-center">{employee.name}</h3>
//                     <p className="text-sm text-gray-600 mb-2">{employee.department}</p>
//                     <span className={`text-xs px-3 py-1 rounded-full border ${getLevelColor(employee.level)}`}>
//                       {employee.level}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Products Sales Section */}
//             <div className="bg-white rounded-3xl border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Products Sales</h2>
//                 <Link href="/sales">
//                   <button className="text-sm text-[#3B5BA5] cursor-pointer font-medium">
//                     View all →
//                   </button>
//                 </Link>
//               </div>

//               <div className="space-y-4">
//                 {products.map((product) => (
//                   <div key={product.id} className="border border-gray-200 rounded-3xl p-4">
//                     <div className="flex items-center justify-between">
//                       {/* Left Side - Product Info */}
//                       <div className="flex items-center gap-4 flex-1">
//                         <div className="flex items-center gap-2">
//                           <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg"></div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 mb-1">{product.id}</p>
//                           <h3 className="font-semibold text-gray-900">{product.clientName}</h3>
//                           <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             <span>Created {product.createdDate}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-1 mx-6">
//                         <svg className={`w-5 h-5 ${getPriorityColor(product.priority)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//                         </svg>
//                         <span className={`text-sm font-medium ${getPriorityColor(product.priority)}`}>
//                           {product.priority}
//                         </span>
//                       </div>

//                       {/* Right Side - Stats */}
//                       <div className="flex items-center gap-8">
//                         <div className="bg-gray-50 px-4 py-3 rounded-3xl">
//                           <h4 className="font-semibold text-gray-900">{product.type}</h4>
//                           <div className="grid grid-cols-3 gap-6 mt-2">
//                             <div>
//                               <p className="text-xs text-gray-500">Amount</p>
//                               <p className="font-semibold text-gray-900">{product.amount}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Category</p>
//                               <p className="font-semibold text-gray-900">{product.category}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-500">Representativ</p>
//                               <div className="flex -space-x-2 mt-1">
//                                 {product.representatives.slice(0, 3).map((rep, idx) => (
//                                   <div
//                                     key={idx}
//                                     className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
//                                   ></div>
//                                 ))}
//                                 {product.representatives.length > 3 && (
//                                   <div className="w-6 h-6 rounded-full bg-[#3B5BA5] border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
//                                     +
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Reminders */}
//           <div className="w-80">
//             <Reminders reminders={reminders} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { SaveIcon, Bell, Calendar, CircleDollarSign, Building2Icon, User2 } from 'lucide-react';

interface Sale {
  id: number;
  date: string;
  client_name: string;
  sales_rep_name: string;
  product_display: string;
  company: string;
  amount: string;
}

interface Interaction {
  id: number;
  client_name: string;
  client_contact: string;
  follow_up_date: string;
  follow_up_time: string;
  priority: string;
  priority_display: string;
}

interface Reminder {
  id: number;
  event_name: string;
  date: string;
  time: string;
  priority: string;
  type: string;
  employee_name: string;
}

const DashboardPage: React.FC = () => {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stickyNotes, setStickyNotes] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/');
    }
  }, [isLoading, token, router]);

  // Load sticky notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stickyNotes');
    if (saved) setStickyNotes(saved);
  }, []);

  // Save sticky notes to localStorage
  const saveStickyNotes = (value: string) => {
    setStickyNotes(value);
    localStorage.setItem('stickyNotes', value);
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Get current user
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);

        // Fetch Sales (filtered based on role)
        const salesRes = await fetch('http://127.0.0.1:8000/api/sales/', { headers });
        const salesData = await salesRes.json();
        if (Array.isArray(salesData)) {
          setSales(salesData.slice(0, 5)); // Only first 5
        }

        // Fetch Interactions (filtered based on role)
        const intRes = await fetch('http://127.0.0.1:8000/api/interactions/', { headers });
        const intData = await intRes.json();
        if (Array.isArray(intData)) {
          setInteractions(intData);
        }

        // Fetch Reminders
        const remRes = await fetch('http://127.0.0.1:8000/api/reminders/', { headers });
        const remData = await remRes.json();
        if (Array.isArray(remData)) {
          setReminders(remData);
        }

      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F9FD]">
        <Sidebar />
        <Navbar />
        <main className="ml-64 mt-16 p-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D8A4E]"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FD]">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">Welcome back, {currentUser?.name || 'User'}!</p>
          <h1 className="text-3xl font-bold text-[#00337C]">Dashboard</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT COLUMN - Interactions Follow-up Reminders */}
          <div className="col-span-2 space-y-6">
            
            {/* Interaction Follow-ups */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <div className='flex gap-2'><Calendar width={20} height={20} color='#00337C'/>   Upcoming Follow-ups</div>
              </h2>
              
              {interactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming follow-ups</p>
              ) : (
                <div className="space-y-3">
                  {interactions.slice(0, 5).map((interaction) => (
                    <div
                      key={interaction.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{interaction.client_name}</h3>
                          <p className="text-sm text-gray-600">{interaction.client_contact}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(interaction.follow_up_date)}
                          </p>
                          <p className="text-sm text-gray-600">{formatTime(interaction.follow_up_time)}</p>
                        </div>
                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(interaction.priority)}`}>
                          {interaction.priority_display}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className='flex gap-2'><CircleDollarSign color='#00337C'/><h2 className="text-xl font-semibold text-gray-900"> Recent Sales</h2></div>
                <span className="text-sm text-gray-500">Last 5 entries</span>
              </div>

              {sales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sales yet</p>
              ) : (
                <div className="space-y-3">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{sale.client_name}</h3>
                          <p className="text-sm text-gray-600">{sale.company} • {sale.product_display}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{formatAmount(sale.amount)}</p>
                          <p className="text-sm text-gray-600">{formatDate(sale.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Sticky Reminders & Notes */}
          <div className="space-y-6">
            
            {/* Regular Reminders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <div className='flex gap-2 mb-4'><Bell color='#00337C'/> <h2 className="text-xl font-semibold text-gray-900">
                Reminders
              </h2></div>

              {reminders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="mt-2 text-gray-500 text-sm">No reminders</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`rounded-lg p-3 border ${getPriorityColor(reminder.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{reminder.event_name}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {formatDate(reminder.date)} at {formatTime(reminder.time)}
                          </p>
                          {currentUser?.role === 'ADMIN' && reminder.employee_name && (
                            <p className="text-xs text-gray-500 mt-1">👤 {reminder.employee_name}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium">
                          {reminder.type === 'CORPORATE' ? <Building2Icon width={18}/> : <User2 width={18}/>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Notes */}
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-6 sticky top-[28rem]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-yellow-900">Sticky Notes</h2>
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>

              <textarea
                value={stickyNotes}
                onChange={(e) => saveStickyNotes(e.target.value)}
                placeholder="Type your notes here..."
                className="w-full h-48 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-400 resize-none text-gray-800 placeholder-yellow-600/50"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
              <div className='flex gap-2 mt-2 text-yellow-700'>
              <SaveIcon width={18} height={18}/> 
              <p className="text-xs text-yellow-700">
                Auto-saved locally
              </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;