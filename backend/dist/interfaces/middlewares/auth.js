"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    const secret = process.env.JWT_SECRET || 'secret';
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Acesso negado. Requer papel: ${role}` });
        }
        next();
    };
};
exports.requireRole = requireRole;
