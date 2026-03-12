"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const zod_1 = require("zod");
class CandidateController {
    constructor(candidateService) {
        this.candidateService = candidateService;
        this.register = async (req, res, next) => {
            try {
                const schema = zod_1.z.object({
                    name: zod_1.z.string().min(2),
                    email: zod_1.z.string().email(),
                    password: zod_1.z.string().min(6)
                });
                const { name, email, password } = schema.parse(req.body);
                const result = await this.candidateService.register(name, email, password);
                const { passwordHash, ...candidateWithoutPassword } = result.candidate;
                res.status(201).json({ candidate: candidateWithoutPassword, token: result.token });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const result = await this.candidateService.login(email, password);
                const { passwordHash, ...candidateWithoutPassword } = result.candidate;
                res.json({ candidate: candidateWithoutPassword, token: result.token });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const candidateId = req.user.id;
                const result = await this.candidateService.getProfile(candidateId);
                const { passwordHash, ...candidateWithoutPassword } = result.candidate;
                res.json({ candidate: candidateWithoutPassword, profile: result.profile });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const candidateId = req.user.id;
                const schema = zod_1.z.object({
                    skills: zod_1.z.array(zod_1.z.string()).optional(),
                    experience: zod_1.z.string().optional(),
                    education: zod_1.z.string().optional()
                });
                const data = schema.parse(req.body);
                const profile = await this.candidateService.updateProfile(candidateId, data);
                res.json(profile);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CandidateController = CandidateController;
