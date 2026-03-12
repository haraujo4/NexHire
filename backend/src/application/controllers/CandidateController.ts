import { Request, Response, NextFunction } from 'express';
import { ICandidateService } from '../../core/interfaces/services/ICandidateService';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

export class CandidateController {
    constructor(private readonly candidateService: ICandidateService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = z.object({
                name: z.string().min(2),
                email: z.string().email(),
                password: z.string().min(6)
            });
            const { name, email, password } = schema.parse(req.body);

            const result = await this.candidateService.register(name, email, password);
            const { passwordHash, ...candidateWithoutPassword } = result.user;

            res.status(201).json({ user: candidateWithoutPassword, token: result.token });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.candidateService.login(email, password);
            const { passwordHash, ...candidateWithoutPassword } = result.user;
            res.json({ user: candidateWithoutPassword, token: result.token });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const candidateId = req.user!.id;
            const result = await this.candidateService.getProfile(candidateId);
            const { passwordHash, ...candidateWithoutPassword } = result.candidate;
            res.json({ candidate: candidateWithoutPassword, profile: result.profile });
        } catch (error) {
            next(error);
        }
    };

    getCandidateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await this.candidateService.getCandidateProfile(id as string);
            const { passwordHash, ...candidateWithoutPassword } = result.candidate;
            res.json({ candidate: candidateWithoutPassword, profile: result.profile });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const candidateId = req.user!.id;
            const schema = z.object({
                name: z.string().min(2).optional(),
                skills: z.array(z.string()).optional(),
                experience: z.string().optional(),
                education: z.string().optional(),
                academicInfo: z.any().optional(),
                professionalInfo: z.any().optional(),
                socialLinks: z.any().optional(),
                portfolioUrl: z.string().url().optional().or(z.literal('')),
                birthDate: z.string().optional(),
                cpf: z.string().optional(),
                phone2: z.string().optional(),
                gender: z.string().optional(),
                address: z.any().optional()
            });
            const data = schema.parse(req.body);


            const profile = await this.candidateService.updateProfile(candidateId, data);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    };

    extractCV = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            console.log('[DEBUG] extractCV - req.file:', req.file);
            console.log('[DEBUG] extractCV - req.body:', req.body);

            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            const result = await this.candidateService.extractCVData(
                req.file.buffer,
                req.file.mimetype
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    summarizeProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const profile = await this.candidateService.summarizeProfile(id as string);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    };
}
