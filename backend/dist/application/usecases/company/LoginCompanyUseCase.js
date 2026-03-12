"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCompanyUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginCompanyUseCase {
    constructor(companyRepo) {
        this.companyRepo = companyRepo;
    }
    async execute(email, passwordPlain) {
        console.log(`[Login Debug] Tentativa de login para: ${email}`);
        const company = await this.companyRepo.findByEmail(email);
        if (!company) {
            console.log(`[Login Debug] Empresa não encontrada no banco: ${email}`);
            throw new Error("Credenciais inválidas");
        }
        const isValid = await bcrypt_1.default.compare(passwordPlain, company.passwordHash);
        if (!isValid) {
            console.log(`[Login Debug] Senha incorreta para: ${email}`);
            throw new Error("Credenciais inválidas");
        }
        const token = this.generateToken(company.id);
        return { company, token };
    }
    generateToken(id) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jsonwebtoken_1.default.sign({ id, role: 'company' }, secret, { expiresIn: '1d' });
    }
}
exports.LoginCompanyUseCase = LoginCompanyUseCase;
