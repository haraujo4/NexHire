"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const zod_1 = require("zod");
class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
        this.register = async (req, res, next) => {
            try {
                const schema = zod_1.z.object({
                    name: zod_1.z.string().min(2),
                    email: zod_1.z.string().email(),
                    password: zod_1.z.string().min(6)
                });
                const { name, email, password } = schema.parse(req.body);
                const result = await this.companyService.register(name, email, password);
                // Remove password hash from response
                const { passwordHash, ...companyWithoutPassword } = result.company;
                res.status(201).json({ company: companyWithoutPassword, token: result.token });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const result = await this.companyService.login(email, password);
                const { passwordHash, ...companyWithoutPassword } = result.company;
                res.json({ user: { ...companyWithoutPassword, role: 'company' }, token: result.token });
            }
            catch (error) {
                next(error);
            }
        };
        this.getStats = async (req, res, next) => {
            try {
                const companyId = req.user.id;
                const stats = await this.companyService.getStats(companyId);
                res.json(stats);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const companyId = req.user.id;
                const profile = await this.companyService.getProfile(companyId);
                res.json(profile);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const companyId = req.user.id;
                const schema = zod_1.z.object({
                    description: zod_1.z.string().optional(),
                    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
                    logoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
                    industry: zod_1.z.string().optional(),
                    size: zod_1.z.string().optional(),
                    address: zod_1.z.any().optional(),
                    socialLinks: zod_1.z.any().optional()
                });
                const data = schema.parse(req.body);
                const profile = await this.companyService.updateProfile(companyId, data);
                res.json(profile);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CompanyController = CompanyController;
