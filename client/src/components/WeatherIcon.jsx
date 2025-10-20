import React from 'react';

export default function WeatherIcon({ main = '', isNight = false, className = '', size = 64 }) {
    const m = main.toLowerCase();

    const props = { width: size, height: size, viewBox: '0 0 64 64', className };

    if (m.includes('clear')) {
        if (isNight) {
            return (
                <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M41 8a20 20 0 1 0 15 33A22 22 0 1 1 41 8Z" fill="currentColor" />
                </svg>
            );
        }
        return (
            <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="32" cy="32" r="12" fill="currentColor" />
                {[0,45,90,135,180,225,270,315].map(a => (
                    <line key={a} x1="32" y1="6" x2="32" y2="16" transform={`rotate(${a} 32 32)`} />
                ))}
            </svg>
        );
    }

    if (m.includes('thunder')) {
        return (
            <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 34a10 10 0 1 1 9-16 12 12 0 1 1 11 20" />
                <path d="M30 40l-6 10h6l-2 8 10-14h-6l4-8z" fill="currentColor" stroke="none" />
            </svg>
        );
    }

    if (m.includes('rain') || m.includes('drizzle')) {
        return (
            <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 34a10 10 0 1 1 9-16 12 12 0 1 1 11 20" />
                {[18,26,34,42].map((x,i)=>(
                    <line key={i} x1={x} y1="42" x2={x-3} y2="50" />
                ))}
            </svg>
        );
    }

    if (m.includes('snow')) {
        return (
            <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 34a10 10 0 1 1 9-16 12 12 0 1 1 11 20" />
                {[22,32,42].map((x,i)=>(
                    <g key={i} transform={`translate(${x} 44)`}>
                        <line x1="-3" y1="0" x2="3" y2="0"/><line x1="0" y1="-3" x2="0" y2="3"/>
                        <line x1="-2" y1="-2" x2="2" y2="2"/><line x1="-2" y1="2" x2="2" y2="-2"/>
                    </g>
                ))}
            </svg>
        );
    }

    if (m.includes('mist') || m.includes('fog') || m.includes('haze')) {
        return (
            <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 30h28M14 36h36M20 42h24" />
            </svg>
        );
    }

    // Хмари (за замовчуванням)
    return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 38a10 10 0 1 1 9-16 12 12 0 1 1 11 20H22Z" fill="currentColor" stroke="none" />
            <path d="M14 38h28" />
        </svg>
    );
}
