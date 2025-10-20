import NodeCache from 'node-cache';

export const weatherCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
export const suggestCache = new NodeCache({ stdTTL: 21600, checkperiod: 600 });
