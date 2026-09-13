import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";

export default function Tasks() {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  // Local state for tasks
  const [localTasks, setLocalTasks] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'I generated this checklist based on the latest market predictions and capacity constraints. How would you like to refine these tasks?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Initialize tasks
  useEffect(() => {
    let initialTasks = data?.tasks || data?.report?.tasks || data?.aiInsights?.tasks || [];
    
    // Fallback to dummy data if context is empty
    if (!initialTasks.length) {
      initialTasks = [
        { id: '1', text: 'Calibrate Weighing Scales at Gate 1 & 2', priority: 'HIGH', status: 'suggested' },
        { id: '2', text: 'Review and Approve 15 Pending Farmer Slots', priority: 'MEDIUM', status: 'suggested' },
        { id: '3', text: 'Clear drainage system before upcoming monsoon advisory', priority: 'LOW', status: 'suggested' },
        { id: '4', text: 'Update MSP rates on main display board', priority: 'LOW', status: 'implemented' }
      ];
    } else {
      // Map API tasks to our format if needed
      initialTasks = initialTasks.map((t, i) => ({
        id: `api-${i}`,
        text: typeof t === 'string' ? t : t.text,
        priority: t.priority || (typeof t === 'string' && t.toLowerCase().includes('sell') ? 'HIGH' : 'MEDIUM'),
        status: 'suggested'
      }));
    }
    setLocalTasks(initialTasks);
  }, [data]);

  const updateTaskStatus = (id, newStatus) => {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Mock AI response for refining
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Understood. I have updated the parameters. Would you like me to auto-approve the high-priority logistics tasks?' 
      }]);
    }, 1000);
  };

  const suggestedTasks = localTasks.filter(t => t.status === 'suggested');
  const approvedTasks = localTasks.filter(t => t.status === 'approved');
  const implementedTasks = localTasks.filter(t => t.status === 'implemented');
  const rejectedTasks = localTasks.filter(t => t.status === 'rejected');

  return (
    <Layout title="Tasks">
      <div className="max-w-7xl mx-auto mt-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">AI-Suggested Operations</h2>
            <p className="text-sm text-gray-400">Review, refine, and track daily mandi operations.</p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="bg-[#0a1f1a] hover:bg-[#112B24] border border-green-900/50 text-green-400 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <i className="fa-solid fa-rotate mr-2"></i> Sync Latest Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TASK LIST (LEFT COL) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Suggested / Pending Approval */}
            <div className="bg-[#112B24] rounded-xl border border-[#E67E22]/30 overflow-hidden">
              <div className="bg-[#0a1f1a] p-4 border-b border-[#E67E22]/30 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb text-[#E67E22]"></i> Suggested AI Tasks
                </h3>
                <span className="bg-[#E67E22]/20 text-[#E67E22] px-2 py-1 rounded text-xs font-bold">{suggestedTasks.length} Pending</span>
              </div>
              <div className="p-4 space-y-3">
                {suggestedTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No pending suggestions.</p>
                ) : (
                  suggestedTasks.map(task => (
                    <div key={task.id} className="flex justify-between items-center bg-[#0a1f1a] p-3 rounded-lg border border-gray-700">
                      <div>
                        <p className="text-white text-sm font-medium">{task.text}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
                          task.priority === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-green-900/50 text-green-400'
                        }`}>{task.priority}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateTaskStatus(task.id, 'approved')} className="w-8 h-8 rounded bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors" title="Approve">
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button onClick={() => updateTaskStatus(task.id, 'rejected')} className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Reject">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Approved & Implemented Tasks */}
            <div className="bg-[#112B24] rounded-xl border border-green-900/30 overflow-hidden">
              <div className="bg-[#0a1f1a] p-4 border-b border-green-900/30">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-green-400"></i> Active & Completed Operations
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {[...approvedTasks, ...implementedTasks].length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No active or implemented tasks.</p>
                ) : (
                  [...approvedTasks, ...implementedTasks].map(task => (
                    <div key={task.id} className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-colors ${
                      task.status === 'implemented' ? 'bg-[#0a1f1a] border-gray-600 opacity-60' : 'bg-[#0a1f1a] border-green-500'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={task.status === 'implemented'}
                          onChange={() => updateTaskStatus(task.id, task.status === 'implemented' ? 'approved' : 'implemented')}
                          className="w-5 h-5 accent-green-500 rounded cursor-pointer" 
                        />
                        <p className={`text-sm font-medium ${task.status === 'implemented' ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.text}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase">{task.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* CHATBOT (RIGHT COL) */}
          <div className="bg-[#112B24] rounded-xl border border-green-900/30 overflow-hidden flex flex-col h-[600px] lg:h-auto">
            <div className="bg-[#0a1f1a] p-4 border-b border-green-900/30 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-robot text-blue-400"></i> Task Refinement AI
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#E67E22] text-white rounded-tr-none' 
                      : 'bg-[#0a1f1a] border border-green-900/50 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#0a1f1a] border-t border-green-900/30">
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI to refine or alter tasks..."
                  className="flex-1 bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E67E22]"
                />
                <button type="submit" className="bg-[#E67E22] text-white px-4 py-2 rounded-lg hover:bg-[#d3721f] transition-colors">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
