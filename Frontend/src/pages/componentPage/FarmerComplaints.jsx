import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { toast } from 'react-toastify';

const FarmerComplaints = () => {
    const [complaint, setComplaint] = useState("");
    const [complaintsList, setComplaintsList] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('farmerComplaints')) || [
            { id: 1, text: "My token OPT-38291 wasn't scanning at Gate 2 yesterday morning.", author: "Farmer Ramesh (Indore)", type: "red" },
            { id: 2, text: "Tractors taking too long to weigh, my afternoon slot was delayed by 3 hours.", author: "Farmer Suresh (Ujjain)", type: "yellow" }
        ];
        setComplaintsList(stored);
        localStorage.setItem('farmerComplaints', JSON.stringify(stored));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!complaint.trim()) return;

        const newComplaint = {
            id: Date.now(),
            text: complaint,
            author: "You (Logged in Farmer)",
            type: "yellow" // Defaulting to yellow border style
        };

        const updatedList = [newComplaint, ...complaintsList];
        setComplaintsList(updatedList);
        localStorage.setItem('farmerComplaints', JSON.stringify(updatedList));
        
        toast.success("Complaint submitted to officials successfully.");
        setComplaint("");
    };

    return (
        <Layout title="Complaints & Suggestions">
            <div className="max-w-4xl mx-auto mt-10 space-y-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Submit a Complaint</h1>
                    <p className="text-gray-400">Report issues with your slot, weighing scales, or general mandi operations directly to the officials.</p>
                </header>

                <section className="bg-[#112B24] p-6 rounded-xl border border-green-900/30">
                    <form onSubmit={handleSubmit}>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Your Complaint / Suggestion</label>
                        <textarea 
                            rows="4" 
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            placeholder="Explain your issue (e.g. My tractor was delayed by 3 hours...)"
                            className="w-full bg-[#0a1f1a] border border-gray-600 rounded-lg p-3 text-white focus:border-[#E67E22] focus:outline-none"
                            required
                        ></textarea>
                        
                        <div className="mt-4 flex justify-end">
                            <button 
                                type="submit" 
                                className="bg-[#E67E22] hover:bg-[#d3721f] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fa-solid fa-paper-plane"></i> Submit to Officials
                            </button>
                        </div>
                    </form>
                </section>

                <section className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4">Previous Submissions</h2>
                    {complaintsList.length === 0 ? (
                        <p className="text-gray-500 italic">No complaints submitted yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {complaintsList.map(c => (
                                <div key={c.id} className={`bg-[#112B24] p-4 rounded-xl border-l-4 ${c.type === 'red' ? 'border-red-500' : 'border-yellow-500'}`}>
                                    <p className="text-gray-200">{c.text}</p>
                                    <span className="text-xs text-gray-500 mt-2 block">- {c.author}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default FarmerComplaints;
