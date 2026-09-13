import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import FarmerSidebar from '../../components/necessary/FarmerSidebar';

const FarmerSlots = () => {
    const { backendURL } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [district, setDistrict] = useState('Indore');
    const [commodity, setCommodity] = useState('Wheat');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${backendURL}/api/bookings/my-slots`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity)) {
            return toast.error("Please enter a valid quantity");
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${backendURL}/api/bookings/request`, {
                district, commodity, quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Slot generated successfully!');
                fetchBookings();
                setQuantity(''); // Reset form
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request slot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-[#031700] min-h-screen text-white font-sans">
            <FarmerSidebar />
            
            <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
                <header className="mb-10 mt-4 md:mt-0">
                    <h1 className="text-3xl font-bold text-white mb-2">Book a Mandi Slot</h1>
                    <p className="text-gray-400">Let our automated system assign you the fastest available slot.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30 h-fit lg:col-span-1">
                        <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-truck-field"></i> Request Slot
                        </h2>
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Your District</label>
                                <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full bg-[#0a1f1a] border border-green-900/30 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500 transition-colors">
                                    <option value="Indore">Indore</option>
                                    <option value="Ujjain">Ujjain</option>
                                    <option value="Bhopal">Bhopal</option>
                                    <option value="Dhar">Dhar</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Crop / Commodity</label>
                                <select value={commodity} onChange={e => setCommodity(e.target.value)} className="w-full bg-[#0a1f1a] border border-green-900/30 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500 transition-colors">
                                    <option value="Wheat">Wheat</option>
                                    <option value="Soybean">Soybean</option>
                                    <option value="Mustard">Mustard</option>
                                    <option value="Gram">Gram (Chana)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Quantity (in Quintals)</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={quantity} 
                                    onChange={e => setQuantity(e.target.value)} 
                                    placeholder="e.g. 50"
                                    required 
                                    className="w-full bg-[#0a1f1a] border border-green-900/30 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500 transition-colors" 
                                />
                            </div>
                            
                            <div className="bg-[#0a1f1a] p-3 rounded-lg border border-[#E67E22]/30 mt-4 text-xs text-gray-400">
                                <i className="fa-solid fa-circle-info text-[#E67E22] mr-2"></i>
                                Our system will automatically assign you a date and time to prevent overcrowding.
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-4">
                                {loading ? 'Generating Slot...' : 'Get Automated Slot'}
                            </button>
                        </form>
                    </div>

                    {/* Bookings List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-clock-rotate-left text-[#E67E22]"></i> Your Generated Slots
                        </h2>
                        
                        {bookings.length === 0 ? (
                            <div className="bg-[#112B24] p-10 rounded-2xl border border-green-900/30 text-center">
                                <i className="fa-solid fa-box-open text-4xl text-green-900/50 mb-4"></i>
                                <p className="text-gray-400 text-lg">You have no booked slots.</p>
                                <p className="text-gray-500 text-sm mt-2">Request a slot using the form to get started.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {bookings.map(b => (
                                    <div key={b._id} className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div className="flex-1 w-full md:w-auto">
                                            <h3 className="text-white font-bold text-xl mb-1">{b.commodity} ({b.quantity || 0} Qtl)</h3>
                                            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                                                <i className="fa-solid fa-location-dot text-[#E67E22]"></i> {b.district || b.mandiName || 'Mandi'} APMC
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <div className="bg-[#0a1f1a] px-4 py-2 rounded-xl border border-green-900/30">
                                                    <span className="text-xs text-gray-500 block font-semibold uppercase tracking-wider mb-0.5">Assigned Date</span>
                                                    <span className="text-white font-bold">{b.allottedDate || b.date || 'TBD'}</span>
                                                </div>
                                                <div className="bg-[#0a1f1a] px-4 py-2 rounded-xl border border-green-900/30">
                                                    <span className="text-xs text-gray-500 block font-semibold uppercase tracking-wider mb-0.5">Time Slot</span>
                                                    <span className="text-[#E67E22] font-bold">{b.allottedTime || b.slotTime || 'TBD'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[#0a1f1a] px-5 py-3 rounded-xl border border-green-900/30 text-center flex flex-col items-center">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Entry Token</span>
                                            <span className="text-green-400 font-mono font-bold text-xl">{b.tokenNumber || 'PENDING'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FarmerSlots;
