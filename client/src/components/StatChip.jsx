import React from 'react';

export default function StatChip({ label, value, unit }) {
    return (
        <div className="stat text-white/90">
            <div className="text-sm opacity-85">{label}</div>
            <div className="text-2xl font-semibold mt-1">
                {value != null ? value : '—'}{unit || ''}
            </div>
        </div>
    );
}
