import { ICandidateRepository } from "../../../core/interfaces/ICandidateRepository";
import { Candidate } from "../../../core/entities/Candidate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MailProvider } from "../../../infrastructure/providers/MailProvider";
import { MailTemplates } from "../../../infrastructure/providers/MailTemplates";

export class RegisterCandidateUseCase {
    constructor(
        private readonly candidateRepo: ICandidateRepository,
        private readonly mailProvider: MailProvider
    ) { }

    async execute(name: string, email: string, passwordPlain: string): Promise<{ user: any, token: string }> {
        const existing = await this.candidateRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }

        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const candidate = await this.candidateRepo.create({ name, email, passwordHash, phone: null, location: null });

        const token = this.generateToken(candidate.id);

        this.mailProvider.sendMail({
            to: candidate.email,
            subject: "Bem-vindo ao NexHire!",
            html: MailTemplates.welcomeCandidate(candidate.name)
        });

        const user = { ...candidate, role: 'candidate' };
        return { user, token };
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'candidate' }, secret, { expiresIn: '1d' });
    }
}
