import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FarmerSidebar from '../../components/necessary/FarmerSidebar';

const FarmerDashboard = () => {
    const { userData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.role === 'OFFICIAL') {
            navigate('/dashboard');
        }
    }, [userData]);

    return (
        <div className="flex bg-[#031700] min-h-screen text-white font-sans">
            <FarmerSidebar />
            
            <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
                <header className="mb-10 mt-4 md:mt-0">
                    <h1 className="text-3xl font-bold text-white mb-2">Mandi Updates & Crop Rates</h1>
                    <p className="text-gray-400">Official announcements and seasonal timelines for {userData?.name || 'Kisan'}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Official Announcements */}
                    <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
                        <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-bullhorn"></i> Official Announcements
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-[#0a1f1a] p-4 rounded-xl border-l-4 border-[#E67E22]">
                                <h3 className="font-bold text-white text-lg">Rabi Harvest Procurement Starts</h3>
                                <p className="text-sm text-gray-400 mt-2">The official government procurement for Rabi crops (Wheat, Mustard) will begin on March 15th. Please ensure you book your slots in advance to avoid long queues at the Mandi gates.</p>
                                <p className="text-xs text-gray-500 mt-3 flex justify-between">
                                    <span>Issued by: Govt APMC</span>
                                    <span>2 days ago</span>
                                </p>
                            </div>
                            <div className="bg-[#0a1f1a] p-4 rounded-xl border-l-4 border-green-500">
                                <h3 className="font-bold text-white text-lg">Weather Advisory: Heavy Rain</h3>
                                <p className="text-sm text-gray-400 mt-2">Expect heavy unseasonal rains in the Malwa region over the next 48 hours. Farmers are advised to safely store harvested soybean and avoid bringing open trolleys to the mandi until the weather clears.</p>
                                <p className="text-xs text-gray-500 mt-3 flex justify-between">
                                    <span>Issued by: Met Dept</span>
                                    <span>Today</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Rates and Timelines */}
                    <div className="space-y-8">
                        <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
                            <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-indian-rupee-sign"></i> Current Minimum Support Price (MSP)
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0a1f1a] p-4 rounded-xl border border-green-900/20 text-center transition-transform hover:scale-105">
                                    <h3 className="text-gray-400 font-semibold mb-1">Wheat</h3>
                                    <p className="text-2xl font-bold text-[#E67E22]">₹2,275 <span className="text-xs text-gray-500">/ Qtl</span></p>
                                </div>
                                <div className="bg-[#0a1f1a] p-4 rounded-xl border border-green-900/20 text-center transition-transform hover:scale-105">
                                    <h3 className="text-gray-400 font-semibold mb-1">Mustard</h3>
                                    <p className="text-2xl font-bold text-[#E67E22]">₹5,650 <span className="text-xs text-gray-500">/ Qtl</span></p>
                                </div>
                                <div className="bg-[#0a1f1a] p-4 rounded-xl border border-green-900/20 text-center transition-transform hover:scale-105">
                                    <h3 className="text-gray-400 font-semibold mb-1">Gram (Chana)</h3>
                                    <p className="text-2xl font-bold text-[#E67E22]">₹5,440 <span className="text-xs text-gray-500">/ Qtl</span></p>
                                </div>
                                <div className="bg-[#0a1f1a] p-4 rounded-xl border border-green-900/20 text-center transition-transform hover:scale-105">
                                    <h3 className="text-gray-400 font-semibold mb-1">Soybean</h3>
                                    <p className="text-2xl font-bold text-[#E67E22]">₹4,600 <span className="text-xs text-gray-500">/ Qtl</span></p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
                            <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-leaf"></i> Seasonal Harvest Selling Windows
                            </h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between items-center bg-[#0a1f1a] p-3 rounded-lg">
                                    <span className="font-semibold text-white">Rabi Season (Wheat, Gram)</span>
                                    <span className="text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded">March - May</span>
                                </li>
                                <li className="flex justify-between items-center bg-[#0a1f1a] p-3 rounded-lg">
                                    <span className="font-semibold text-white">Kharif Season (Soybean)</span>
                                    <span className="text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded">Oct - Dec</span>
                                </li>
                                <li className="flex justify-between items-center bg-[#0a1f1a] p-3 rounded-lg">
                                    <span className="font-semibold text-white">Zaid Season (Moong)</span>
                                    <span className="text-gray-400 font-bold bg-gray-900/50 px-2 py-1 rounded">June - July</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default FarmerDashboard;
