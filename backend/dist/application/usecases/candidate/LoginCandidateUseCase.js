"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCandidateUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginCandidateUseCase {
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(email, passwordPlain) {
        const candidate = await this.candidateRepo.findByEmail(email);
        if (!candidate) {
            throw new Error("Credenciais inválidas");
        }
        const isValid = await bcrypt_1.default.compare(passwordPlain, candidate.passwordHash);
        if (!isValid) {
            throw new Error("Credenciais inválidas");
        }
        const token = this.generateToken(candidate.id);
        const user = { ...candidate, role: 'candidate' };
        return { user, token };
    }
    generateToken(id) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jsonwebtoken_1.default.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
exports.LoginCandidateUseCase = LoginCandidateUseCase;
