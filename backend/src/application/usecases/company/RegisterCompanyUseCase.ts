import { ICompanyRepository } from "../../../core/interfaces/ICompanyRepository";
import { Company } from "../../../core/entities/Company";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class RegisterCompanyUseCase {
    constructor(private readonly companyRepo: ICompanyRepository) { }

    async execute(name: string, email: string, passwordPlain: string): Promise<{ company: Company, token: string }> {
        const existing = await this.companyRepo.findByEmail(email);
        if (existing) {
            throw new Error("Email já está em uso");
        }

        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        const company = await this.companyRepo.create({ name, email, passwordHash });

        const token = this.generateToken(company.id);
        return { company, token };
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'company' }, secret, { expiresIn: '1d' });
    }
}
