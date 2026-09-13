import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Layout from './Layout';
import { toast } from 'react-toastify';

const ManageSlots = () => {
    const { backendURL } = useContext(AuthContext);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${backendURL}/api/bookings/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setSlots(data.bookings);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        toast.info(`Status updated to ${status}`);
        // In a real app, this would hit a PUT /api/bookings/:id endpoint
        setSlots(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    };

    return (
        <Layout title="Manage Slots">
            <div className="max-w-7xl mx-auto mt-10 space-y-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Mandi Slot Management</h1>
                    <p className="text-gray-400">Oversee incoming farmer harvest arrivals, handle complaints, and manage capacities.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* All Slots Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-[#112B24] rounded-xl border border-green-900/30 overflow-hidden">
                            <div className="p-4 bg-[#0a1f1a] border-b border-green-900/50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <i className="fa-solid fa-list-check text-green-400"></i> All Assigned Slots
                                </h2>
                                <button onClick={fetchSlots} className="text-sm text-[#E67E22] hover:underline">
                                    <i className="fa-solid fa-rotate-right"></i> Refresh
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-[#0a1f1a] text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3">Token</th>
                                            <th className="px-4 py-3">Farmer</th>
                                            <th className="px-4 py-3">Details</th>
                                            <th className="px-4 py-3">Arrival Slot</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-900/30 text-gray-300">
                                        {(slots.length > 0 ? slots : [
                                            { _id: 'd1', tokenNumber: 'OPT-48291', farmerName: 'Ramesh Patel', district: 'Indore', commodity: 'Wheat', quantity: 50, allottedDate: '2023-11-15', allottedTime: 'Morning', status: 'APPROVED' },
                                            { _id: 'd2', tokenNumber: 'OPT-19283', farmerName: 'Suresh Kumar', district: 'Ujjain', commodity: 'Soybean', quantity: 120, allottedDate: '2023-11-15', allottedTime: 'Afternoon', status: 'PENDING' },
                                            { _id: 'd3', tokenNumber: 'OPT-57211', farmerName: 'Anil Sharma', district: 'Bhopal', commodity: 'Mustard', quantity: 30, allottedDate: '2023-11-16', allottedTime: 'Morning', status: 'APPROVED' },
                                            { _id: 'd4', tokenNumber: 'OPT-83719', farmerName: 'Vikram Singh', district: 'Indore', commodity: 'Wheat', quantity: 80, allottedDate: '2023-11-16', allottedTime: 'Afternoon', status: 'REJECTED' }
                                        ]).map(slot => (
                                            <tr key={slot._id} className="hover:bg-[#0a1f1a]/50">
                                                <td className="px-4 py-3 font-mono text-green-400">{slot.tokenNumber || '---'}</td>
                                                <td className="px-4 py-3 font-semibold text-white">{slot.farmerName}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-white">{slot.commodity} ({slot.quantity || 0} Qtl)</span>
                                                        <span className="text-xs text-gray-500">{slot.district || slot.mandiName} APMC</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="block text-white">{slot.allottedDate || slot.date}</span>
                                                    <span className="text-xs text-[#E67E22] font-bold">{slot.allottedTime || slot.slotTime}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                        slot.status === 'APPROVED' ? 'bg-green-900/50 text-green-400' :
                                                        slot.status === 'REJECTED' ? 'bg-red-900/50 text-red-400' :
                                                        'bg-yellow-900/50 text-yellow-400'
                                                    }`}>
                                                        {slot.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select 
                                                        className="bg-[#0a1f1a] text-xs border border-green-900/50 rounded p-1 text-white outline-none"
                                                        value={slot.status}
                                                        onChange={(e) => updateStatus(slot._id, e.target.value)}
                                                    >
                                                        <option value="APPROVED">APPROVE</option>
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="REJECTED">REJECT</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar for Complaints & Planning */}
                    <div className="space-y-6">
                        {/* Mandi Capacity Planning */}
                        <section className="bg-[#112B24] p-5 rounded-xl border border-green-900/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-chart-pie text-[#E67E22]"></i> Capacity Planning
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Gate 1 (Wheat)</span>
                                        <span className="text-red-400 font-bold">92%</span>
                                    </div>
                                    <div className="w-full bg-[#0a1f1a] rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Gate 2 (Soybean)</span>
                                        <span className="text-green-400 font-bold">45%</span>
                                    </div>
                                    <div className="w-full bg-[#0a1f1a] rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Gate 3 (Mixed)</span>
                                        <span className="text-yellow-400 font-bold">78%</span>
                                    </div>
                                    <div className="w-full bg-[#0a1f1a] rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-[#0a1f1a] border border-[#E67E22]/30 rounded-lg text-xs text-gray-300">
                                    <strong className="text-[#E67E22] block mb-1">AI Suggestion:</strong>
                                    Re-route incoming Wheat tractors to Gate 3 to prevent tailbacks on main highway.
                                </div>
                            </div>
                        </section>

                        {/* Farmer Complaints */}
                        <section className="bg-[#112B24] p-5 rounded-xl border border-green-900/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-triangle-exclamation text-red-400"></i> Slot Complaints
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-[#0a1f1a] p-3 rounded-lg border-l-2 border-red-500">
                                    <p className="text-sm text-gray-200">"My token OPT-38291 wasn't scanning at Gate 2 yesterday morning."</p>
                                    <span className="text-[10px] text-gray-500 mt-2 block">- Farmer Ramesh (Indore)</span>
                                </div>
                                <div className="bg-[#0a1f1a] p-3 rounded-lg border-l-2 border-yellow-500">
                                    <p className="text-sm text-gray-200">"Tractors taking too long to weigh, my afternoon slot was delayed by 3 hours."</p>
                                    <span className="text-[10px] text-gray-500 mt-2 block">- Farmer Suresh (Ujjain)</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 py-2 rounded-lg text-sm transition-colors">
                                View All Complaints
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManageSlots;
