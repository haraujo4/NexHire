"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const companyRoutes_1 = __importDefault(require("./companyRoutes"));
const candidateRoutes_1 = __importDefault(require("./candidateRoutes"));
const publicRoutes_1 = __importDefault(require("./publicRoutes"));
exports.router = (0, express_1.Router)();
exports.router.use('/company', companyRoutes_1.default);
exports.router.use('/candidate', candidateRoutes_1.default);
exports.router.use('/public', publicRoutes_1.default);
