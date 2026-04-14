import React, { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * System Integrity Monitoring Dashboard
 * Provides real-time visibility into the health of critical connection pathways.
 */
const SystemIntegrityStatus = () => {
    const [integrity, setIntegrity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIntegrity = async () => {
        try {
            const res = await api.get('/health/integrity');
            setIntegrity(res.data);
            setError(null);
        } catch (err) {
            setError('Strategic Sync Failure');
            console.error('[INTEGRITY] Connection terminated:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrity();
        const interval = setInterval(fetchIntegrity, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading && !integrity) return <div style={{ color: '#888', fontSize: '10px' }}>INITIALIZING SCAN...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return '#00e87a';
            case 'operational': return '#00e87a';
            case 'degraded': return '#f5a623';
            case 'critical': return '#ff4444';
            default: return '#888';
        }
    };

    return (
        <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px',
            fontFamily: "'Inter', monospace",
            fontSize: '11px',
            color: '#fff',
            borderRadius: '2px',
            width: '240px'
        }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '10px', letterSpacing: '0.1em', color: '#888' }}>CENTRAL INTELLIGENCE LINKS</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <LinkItem label="DATABASE" status={integrity?.dependencies?.database || 'offline'} color={getStatusColor(integrity?.dependencies?.database)} />
                <LinkItem label="MEMORY GRID" status={integrity?.dependencies?.cache || 'offline'} color={getStatusColor(integrity?.dependencies?.cache)} />
                <LinkItem label="AI ENGINE" status="active" color="#00e87a" />
            </div>

            {error && (
                <div style={{ marginTop: '10px', color: '#ff4444', fontSize: '9px', borderTop: '1px solid rgba(255,68,68,0.2)', paddingTop: '5px' }}>
                    {error}
                </div>
            )}
            
            <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '9px', color: '#444' }}>
                SCAN: {new Date(integrity?.dependencies?.systemTime || new Date()).toLocaleTimeString()}
            </div>
        </div>
    );
};

const LinkItem = ({ label, status, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#aaa' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '9px', color: color }}>{status.toUpperCase()}</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}` }}></div>
        </div>
    </div>
);

export default SystemIntegrityStatus;
