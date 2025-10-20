export const normalizeCity = (raw = '') =>
    raw
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
