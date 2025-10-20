export function themeClassFromWeather(main) {
    const m = (main || '').toLowerCase();
    if (m.includes('clear')) return 'bg-gradient-to-br from-[#56CCF2] to-[#2F80ED]';
    if (m.includes('rain') || m.includes('drizzle') || m.includes('thunder'))
        return 'bg-gradient-to-br from-[#1f2937] to-[#111827]';
    if (m.includes('snow')) return 'bg-gradient-to-br from-[#dfe9f3] to-[#ffffff]';
    if (m.includes('cloud')) return 'bg-gradient-to-br from-[#94a3b8] to-[#475569]';
    if (m.includes('mist') || m.includes('fog') || m.includes('haze'))
        return 'bg-gradient-to-br from-[#64748b] to-[#334155]';
    return 'bg-gradient-to-br from-[#667eea] to-[#764ba2]';
}
