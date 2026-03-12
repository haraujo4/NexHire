import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { Candidate } from "../../../core/entities/Candidate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class RegisterCandidateUseCase {
    constructor(private readonly candidateRepo: ICandidateRepository) { }

    async execute(name: string, email: string, passwordPlain: string): Promise<{ candidate: Candidate, token: string }> {
        const existing = await this.candidateRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }

        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const candidate = await this.candidateRepo.create({ name, email, passwordHash, phone: null, location: null });

        const token = this.generateToken(candidate.id);
        return { candidate, token };
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
