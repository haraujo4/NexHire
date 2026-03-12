"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCandidateUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MailTemplates_1 = require("../../../infrastructure/providers/MailTemplates");
class RegisterCandidateUseCase {
    constructor(candidateRepo, mailProvider) {
        this.candidateRepo = candidateRepo;
        this.mailProvider = mailProvider;
    }
    async execute(name, email, passwordPlain) {
        const existing = await this.candidateRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }
        const passwordHash = await bcrypt_1.default.hash(passwordPlain, 10);
        const candidate = await this.candidateRepo.create({ name, email, passwordHash, phone: null, location: null });
        const token = this.generateToken(candidate.id);
        this.mailProvider.sendMail({
            to: candidate.email,
            subject: "Bem-vindo ao NexHire!",
            html: MailTemplates_1.MailTemplates.welcomeCandidate(candidate.name)
        });
        const user = { ...candidate, role: 'candidate' };
        return { user, token };
    }
    generateToken(id) {
        const secret = process.env.JWT_SECRET || 'secret';
        return jsonwebtoken_1.default.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
exports.RegisterCandidateUseCase = RegisterCandidateUseCase;
