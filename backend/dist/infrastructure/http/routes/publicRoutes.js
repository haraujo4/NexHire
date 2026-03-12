"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/jobs', (req, res, next) => req.container.jobController.list(req, res, next));
router.get('/jobs/:id', (req, res, next) => req.container.jobController.getById(req, res, next));
exports.default = router;
