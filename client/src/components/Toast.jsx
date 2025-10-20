import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const push = useCallback((t) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(s => [...s, { id, timeout: 4000, type: 'error', ...t }]);
        return id;
    }, []);

    const remove = useCallback((id) => {
        setToasts(s => s.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        const timers = toasts.map(t => setTimeout(() => remove(t.id), t.timeout));
        return () => timers.forEach(clearTimeout);
    }, [toasts, remove]);

    return (
        <ToastCtx.Provider value={{ push, remove }}>
            {children}
            {createPortal(
                <div className="fixed right-4 top-4 z-[9999] space-y-3">
                    {toasts.map(t => (
                        <div
                            key={t.id}
                            role="status"
                            className={`rounded-xl px-4 py-3 shadow-lg border backdrop-blur text-white
                          ${t.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/70'
                                : t.type === 'warn' ? 'bg-amber-500/90 border-amber-400/70'
                                    : 'bg-rose-500/90 border-rose-400/70'}`}
                        >
                            <div className="font-semibold">{t.title || (t.type === 'success' ? 'Готово' : 'Помилка')}</div>
                            {t.message && <div className="text-white/95">{t.message}</div>}
                            {t.hint && <div className="text-white/80 text-xs mt-1">{t.hint}</div>}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastCtx.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
