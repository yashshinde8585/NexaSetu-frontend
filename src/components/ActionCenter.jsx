import React, { useState, useEffect } from 'react';
import { getPendingActions, approveAction, rejectAction } from '../api/actionService';
import { X, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ActionCenter = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchActions();
        }
    }, [isOpen]);

    const fetchActions = async () => {
        try {
            setLoading(true);
            const res = await getPendingActions();
            setActions(res.data?.actions || []);
        } catch (error) {
            console.error('Failed to fetch actions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setProcessingId(id);
            await approveAction(id);
            setActions(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            console.error('Approval failed', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessingId(id);
            await rejectAction(id);
            setActions(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            console.error('Rejection failed', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-background-dark/90 backdrop-blur-2xl border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                            <Activity size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-white">Execution Oversight</h2>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Nexa Command Center</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : actions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                            <CheckCircle size={48} className="text-status-success mb-4" />
                            <p className="text-sm font-bold text-white">All Clear</p>
                            <p className="text-xs text-text-muted mt-1">No pending strategic actions require executive approval.</p>
                        </div>
                    ) : (
                        actions.map(action => (
                            <div key={action._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all hover:border-primary/30">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                        {action.type.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[10px] text-text-muted font-mono bg-black/20 px-2 py-0.5 rounded">
                                        Agent: {action.agent || 'Nexa'}
                                    </span>
                                </div>
                                <p className="text-sm text-white/90 font-medium mb-4 leading-relaxed">
                                    {action.reason}
                                </p>
                                
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => handleApprove(action._id)}
                                        disabled={processingId === action._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-status-success/10 hover:bg-status-success/20 text-status-success border border-status-success/20 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                    >
                                        <CheckCircle size={14} /> APPROVE
                                    </button>
                                    <button 
                                        onClick={() => handleReject(action._id)}
                                        disabled={processingId === action._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-status-danger/20 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                    >
                                        <XCircle size={14} /> REJECT
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionCenter;
