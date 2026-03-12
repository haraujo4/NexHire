"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("./infrastructure/http/routes");
const scopedContainer_1 = require("./application/middlewares/scopedContainer");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(scopedContainer_1.scopedContainerMiddleware);
// Main Router
app.use('/api', routes_1.router);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware
app.use((err, req, res, next) => {
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
