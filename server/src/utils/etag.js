import crypto from 'crypto';
export const makeEtag = (obj) =>
    `"${crypto.createHash('sha1').update(JSON.stringify(obj)).digest('hex')}"`;
