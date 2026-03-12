import { ICompanyRepository } from "../../../core/interfaces/ICompanyRepository";
import { Company } from "../../../core/entities/Company";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginCompanyUseCase {
    constructor(private readonly companyRepo: ICompanyRepository) { }

    async execute(email: string, passwordPlain: string): Promise<{ user: any, token: string }> {
        console.log(`[Login Debug] Tentativa de login para: ${email}`);
        try {
            const company = await this.companyRepo.findByEmail(email);

            if (!company) {
                console.log(`[Login Debug] Empresa não encontrada no banco: ${email}`);
                throw new Error("Credenciais inválidas");
            }

            console.log(`[Login Debug] Empresa encontrada: ${company.id}. Comparando senhas...`);

            if (!company.passwordHash) {
                console.error(`[Login Debug] ERRO: hash de senha ausente para empresa ${email}`);
                throw new Error("Erro na configuração da conta. Por favor, contate o suporte.");
            }

            const isValid = await bcrypt.compare(passwordPlain, company.passwordHash);
            if (!isValid) {
                console.log(`[Login Debug] Senha incorreta para: ${email}`);
                throw new Error("Credenciais inválidas");
            }

            console.log(`[Login Debug] Login bem-sucedido: ${email}`);
            const token = this.generateToken(company.id);
            const user = { ...company, role: 'company' };
            return { user, token };
        } catch (error: any) {
            console.error(`[Login Debug] Erro durante o processo de login:`, error);
            throw error;
        }
    }

    private generateToken(id: string): string {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign({ id, role: 'company' }, secret, { expiresIn: '1d' });
    }
}
