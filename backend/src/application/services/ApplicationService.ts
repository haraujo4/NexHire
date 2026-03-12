import { IApplicationService } from "../../core/interfaces/services/IApplicationService";
import { Application } from "../../core/entities/Application";
import { ApplyForJobUseCase } from "../usecases/application/ApplyForJobUseCase";
import { GetApplicationsUseCase } from "../usecases/application/GetApplicationsUseCase";
import { UpdateApplicationStatusUseCase } from "../usecases/application/UpdateApplicationStatusUseCase";
import { EvaluateCompatibilityUseCase } from "../usecases/application/EvaluateCompatibilityUseCase";
import { SimulateCompatibilityUseCase } from "../usecases/application/SimulateCompatibilityUseCase";

export class ApplicationService implements IApplicationService {
    constructor(
        private readonly applyUC: ApplyForJobUseCase,
        private readonly getAppsUC: GetApplicationsUseCase,
        private readonly updateStatusUC: UpdateApplicationStatusUseCase,
        private readonly evaluateAIUC: EvaluateCompatibilityUseCase,
        private readonly simulateUC: SimulateCompatibilityUseCase
    ) { }

    async apply(candidateId: string, jobId: string, formResponses?: any): Promise<Application> {
        return this.applyUC.execute(candidateId, jobId, formResponses, (id) => this.evaluateAIUC.execute(id));
    }


    async getApplicationsForJob(jobId: string, companyId: string): Promise<Application[]> {
        return this.getAppsUC.executeForJob(jobId, companyId);
    }

    async getApplicationsForCandidate(candidateId: string): Promise<Application[]> {
        return this.getAppsUC.executeForCandidate(candidateId);
    }

    async updateStatus(applicationId: string, companyId: string, status: string): Promise<Application> {
        return this.updateStatusUC.execute(applicationId, companyId, status);
    }

    async evaluate(applicationId: string): Promise<Application> {
        const result = await this.evaluateAIUC.execute(applicationId);
        if (!result) throw new Error("Falha ao avaliar candidatura ou candidatura não encontrada.");
        return result;
    }

    async simulate(candidateId: string, jobId: string, formResponses?: any): Promise<any> {
        return this.simulateUC.execute(candidateId, jobId, formResponses);
    }
}

