"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCandidateUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class RegisterCandidateUseCase {
    constructor(candidateRepo) {
        this.candidateRepo = candidateRepo;
    }
    async execute(name, email, passwordPlain) {
        const existing = await this.candidateRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }
        const passwordHash = await bcrypt_1.default.hash(passwordPlain, 10);
        const candidate = await this.candidateRepo.create({ name, email, passwordHash, phone: null, location: null });
        const token = this.generateToken(candidate.id);
        return { candidate, token };
    }
    generateToken(id) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jsonwebtoken_1.default.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
exports.RegisterCandidateUseCase = RegisterCandidateUseCase;
