import { Request, Response, NextFunction } from 'express';
import { ICompanyService } from '../../core/interfaces/services/ICompanyService';
import { z } from 'zod';

export class CompanyController {
    constructor(private readonly companyService: ICompanyService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = z.object({
                name: z.string().min(2),
                email: z.string().email(),
                password: z.string().min(6)
            });
            const { name, email, password } = schema.parse(req.body);

            const result = await this.companyService.register(name, email, password);
            // Remove password hash from response
            const { passwordHash, ...companyWithoutPassword } = result.user;

            res.status(201).json({ user: companyWithoutPassword, token: result.token });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.companyService.login(email, password);
            const { passwordHash, ...companyWithoutPassword } = result.user;
            res.json({ user: companyWithoutPassword, token: result.token });
        } catch (error) {
            next(error);
        }
    };

    getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = (req as any).user.id;
            const stats = await this.companyService.getStats(companyId);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = (req as any).user.id;
            const profile = await this.companyService.getProfile(companyId);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = (req as any).user.id;
            const schema = z.object({
                description: z.string().optional(),
                website: z.string().url().optional().or(z.literal('')),
                logoUrl: z.string().url().optional().or(z.literal('')),
                industry: z.string().optional(),
                size: z.string().optional(),
                address: z.any().optional(),
                socialLinks: z.any().optional()
            });
            const data = schema.parse(req.body);
            const profile = await this.companyService.updateProfile(companyId, data);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    };
}
