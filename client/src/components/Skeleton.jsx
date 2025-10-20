import React from 'react';

export default function Skeleton() {
    return (
        <div className="card p-6 text-white animate-pulse">
            <div className="h-6 w-40 bg-white/20 rounded mb-3"></div>
            <div className="h-4 w-56 bg-white/15 rounded mb-6"></div>
            <div className="h-20 w-40 bg-white/20 rounded mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl p-4 border border-white/15 bg-white/10 h-16" />
                ))}
            </div>
        </div>
    );
}
