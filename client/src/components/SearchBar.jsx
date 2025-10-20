import React, { useEffect, useRef, useState } from 'react';
import SuggestList from './SuggestList';

export default function SearchBar({ city, setCity, loading, onSubmit, onPickCoords }) {
    const [suggests, setSuggests] = useState([]);
    const [open, setOpen] = useState(false);
    const [hi, setHi] = useState(-1);
    const rootRef = useRef(null);
    const abortRef = useRef(null);
    const blurTimer = useRef(null);

    // клік поза списком — закрити
    useEffect(() => {
        function onDoc(e) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        const q = city.trim();
        if (q.length < 2) { setSuggests([]); setOpen(false); return; }
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const id = setTimeout(async () => {
            try {
                const r = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
                const data = await r.json();
                setSuggests(data);
                setOpen(true);
                setHi(-1);
            } catch {}
        }, 250);
        return () => { clearTimeout(id); ctrl.abort(); };
    }, [city]);

    function pick(it) {
        setCity(it.name);
        setOpen(false);
        onPickCoords?.(it.lat, it.lon);
    }

    function handleKeyDown(e) {
        if (open && suggests.length) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHi(i => Math.min(i + 1, suggests.length - 1)); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); setHi(i => Math.max(i - 1, 0)); }
            if (e.key === 'Enter' && hi >= 0) { e.preventDefault(); pick(suggests[hi]); }
            if (e.key === 'Escape') { setOpen(false); setHi(-1); }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <form
            ref={rootRef}
            onSubmit={(e)=>{ setOpen(false); onSubmit(e); }}
            className="relative mb-8"
        >
            <div className="flex gap-3">
                <input
                    type="text"
                    value={city}
                    onChange={(e)=> setCity(e.target.value)}
                    onFocus={()=> suggests.length && setOpen(true)}
                    onKeyDown={handleKeyDown}
                    onBlur={()=> { blurTimer.current = setTimeout(()=> setOpen(false), 100); }}
                    onMouseDown={()=> { if (blurTimer.current) clearTimeout(blurTimer.current); }}
                    placeholder="Введіть місто (наприклад: Київ)"
                    className="input"
                    aria-label="Місто"
                />
                <button
                    type="submit"
                    className="btn bg-white text-slate-900 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading || !city.trim()}
                >
                    {loading ? 'Завантаження…' : 'Пошук'}
                </button>
            </div>

            {open && (
                <SuggestList
                    items={suggests}
                    highlighted={hi}
                    onMouseDownItem={(it)=> { if (blurTimer.current) clearTimeout(blurTimer.current); pick(it); }}
                />
            )}
        </form>
    );
}
