import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { Candidate } from "../../../core/entities/Candidate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginCandidateUseCase {
    constructor(private readonly candidateRepo: ICandidateRepository) { }

    async execute(email: string, passwordPlain: string): Promise<{ user: any, token: string }> {
        const candidate = await this.candidateRepo.findByEmail(email);
        if (!candidate) {
            throw new Error("Credenciais inválidas");
        }

        const isValid = await bcrypt.compare(passwordPlain, candidate.passwordHash);
        if (!isValid) {
            throw new Error("Credenciais inválidas");
        }

        const token = this.generateToken(candidate.id);
        const user = { ...candidate, role: 'candidate' };
        return { user, token };
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
