import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import weatherRouter from './routes/weather.routes.js';
import suggestRouter from './routes/suggest.routes.js';
import { errorHandler, notFound } from './middleware/error.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app = express();

app.get('/api/debug', (req, res) => {
    const k = process.env.OWM_API_KEY || '';
    res.json({ hasKey: !!k, keyPreview: k ? k.slice(0,4) + '***' : null });
});

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173','http://127.0.0.1:5173'] }));
app.use(compression());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api', apiLimiter);

// маршрути
app.use('/api/weather', weatherRouter);
app.use('/api/suggest', suggestRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
