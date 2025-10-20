import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { ToastProvider, useToast } from './components/Toast.jsx';

function GlobalGuards({ children }) {
    const { push } = useToast();
    React.useEffect(() => {
        function onRejection(e) {
            push({ type: 'error', title: 'Неочікувана помилка', message: e?.reason?.message || 'Unhandled rejection' });
        }
        window.addEventListener('unhandledrejection', onRejection);
        return () => window.removeEventListener('unhandledrejection', onRejection);
    }, [push]);
    return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <GlobalGuards>
                <App />
            </GlobalGuards>
        </ToastProvider>
    </React.StrictMode>
);
