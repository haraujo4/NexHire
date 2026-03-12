require('dotenv').config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './infrastructure/http/routes';
import { scopedContainerMiddleware } from './application/middlewares/scopedContainer';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(scopedContainerMiddleware);

// Main Router
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    console.error(`[Global Error] status: ${status}, message: ${message}`);
    if (status === 500) {
        console.error(err.stack);
    }

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
