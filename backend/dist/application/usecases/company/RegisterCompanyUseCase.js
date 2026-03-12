"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCompanyUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class RegisterCompanyUseCase {
    constructor(companyRepo) {
        this.companyRepo = companyRepo;
    }
    async execute(name, email, passwordPlain) {
        const existing = await this.companyRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }
        const passwordHash = await bcrypt_1.default.hash(passwordPlain, 10);
        const company = await this.companyRepo.create({ name, email, passwordHash });
        const token = this.generateToken(company.id);
        return { company, token };
    }
    generateToken(id) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jsonwebtoken_1.default.sign({ id, role: 'company' }, secret, { expiresIn: '1d' });
    }
}
exports.RegisterCompanyUseCase = RegisterCompanyUseCase;
