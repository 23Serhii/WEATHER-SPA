import React from 'react';

export default function SuggestList({ items, highlighted, onMouseDownItem }) {
    if (!items?.length) return null;
    return (
        <div className="absolute z-20 mt-2 w-full rounded-xl bg-white text-slate-900 shadow-xl overflow-hidden border border-black/10">
            {items.map((it, idx) => {
                const label = [it.name, it.state, it.country].filter(Boolean).join(', ');
                const active = idx === highlighted;
                return (
                    <div
                        key={`${it.name}-${it.lat}-${it.lon}-${idx}`}
                        className={`px-4 py-2 cursor-pointer ${active ? 'bg-slate-100' : 'bg-white'} hover:bg-slate-50`}
                        onMouseDown={() => onMouseDownItem(it)}
                    >
                        {label}
                    </div>
                );
            })}
        </div>
    );
}
