import { ICompanyRepository } from "../../../core/interfaces/ICompanyRepository";
import { Company } from "../../../core/entities/Company";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MailProvider } from "../../../infrastructure/providers/MailProvider";
import { MailTemplates } from "../../../infrastructure/providers/MailTemplates";

export class RegisterCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly mailProvider: MailProvider
    ) { }

    async execute(name: string, email: string, passwordPlain: string): Promise<{ user: any, token: string }> {
        const existing = await this.companyRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }

        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const company = await this.companyRepo.create({ name, email, passwordHash });

        const token = this.generateToken(company.id);

        this.mailProvider.sendMail({
            to: company.email,
            subject: "Sua jornada no NexHire começa agora!",
            html: MailTemplates.welcomeCompany(company.name)
        });

        const user = { ...company, role: 'company' };
        return { user, token };
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'company' }, secret, { expiresIn: '1d' });
    }
}
