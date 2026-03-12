"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopedContainerMiddleware = void 0;
const container_1 = require("../../infrastructure/container");
const scopedContainerMiddleware = (req, res, next) => {
    // This creates a NEW instance of DIContainer for this request.
    // 'Scoped' items within this container will be singletons per request.
    req.container = new container_1.DIContainer();
    next();
};
exports.scopedContainerMiddleware = scopedContainerMiddleware;
