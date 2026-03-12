// Infrastructure Providers & Repositories
import { CompanyRepository } from "../repositories/CompanyRepository";
import { CandidateRepository } from "../repositories/CandidateRepository";
import { JobRepository } from "../repositories/JobRepository";
import { ApplicationRepository } from "../repositories/ApplicationRepository";
import { GeminiProvider } from "../providers/GeminiProvider";
import { MailProvider } from "../providers/MailProvider";
import { AIAnalysisCacheRepository } from "../repositories/AIAnalysisCacheRepository";
import { CVParsingService } from "../services/CVParsingService";

// Use Cases
import { CreateJobUseCase } from "../../application/usecases/job/CreateJobUseCase";
import { GetJobsUseCase } from "../../application/usecases/job/GetJobsUseCase";
import { GetJobByIdUseCase } from "../../application/usecases/job/GetJobByIdUseCase";
import { UpdateJobUseCase } from "../../application/usecases/job/UpdateJobUseCase";
import { DeleteJobUseCase } from "../../application/usecases/job/DeleteJobUseCase";
import { CloseJobUseCase } from "../../application/usecases/job/CloseJobUseCase";
import { AssistJobCreationUseCase } from "../../application/usecases/job/AssistJobCreationUseCase";
import { RegisterCompanyUseCase } from "../../application/usecases/company/RegisterCompanyUseCase";
import { LoginCompanyUseCase } from "../../application/usecases/company/LoginCompanyUseCase";
import { GetCompanyDashboardStatsUseCase } from "../../application/usecases/company/GetCompanyDashboardStatsUseCase";
import { GetCompanyProfileUseCase } from "../../application/usecases/company/GetCompanyProfileUseCase";
import { UpdateCompanyProfileUseCase } from "../../application/usecases/company/UpdateCompanyProfileUseCase";
import { RegisterCandidateUseCase } from "../../application/usecases/candidate/RegisterCandidateUseCase";
import { LoginCandidateUseCase } from "../../application/usecases/candidate/LoginCandidateUseCase";
import { GetCandidateProfileUseCase } from "../../application/usecases/candidate/GetCandidateProfileUseCase";
import { UpdateCandidateProfileUseCase } from "../../application/usecases/candidate/UpdateCandidateProfileUseCase";
import { ExtractCVDataUseCase } from "../../application/usecases/candidate/ExtractCVDataUseCase";
import { SummarizeCandidateProfileUseCase } from "../../application/usecases/candidate/SummarizeCandidateProfileUseCase";
import { ApplyForJobUseCase } from "../../application/usecases/application/ApplyForJobUseCase";
import { GetApplicationsUseCase } from "../../application/usecases/application/GetApplicationsUseCase";
import { UpdateApplicationStatusUseCase } from "../../application/usecases/application/UpdateApplicationStatusUseCase";
import { EvaluateCompatibilityUseCase } from "../../application/usecases/application/EvaluateCompatibilityUseCase";
import { SimulateCompatibilityUseCase } from "../../application/usecases/application/SimulateCompatibilityUseCase";

// Services
import { CompanyService } from "../../application/services/CompanyService";
import { CandidateService } from "../../application/services/CandidateService";
import { JobService } from "../../application/services/JobService";
import { ApplicationService } from "../../application/services/ApplicationService";

// Controllers
import { CompanyController } from "../../application/controllers/CompanyController";
import { CandidateController } from "../../application/controllers/CandidateController";
import { JobController } from "../../application/controllers/JobController";
import { ApplicationController } from "../../application/controllers/ApplicationController";

type Lifecycle = 'Singleton' | 'Scoped' | 'Transient';

export class DIContainer {
    private static _singletons = new Map<string, any>();
    private _scoped = new Map<string, any>();

    // Centralized Resolution Logic
    private resolve<T>(key: string, lifecycle: Lifecycle, factory: () => T): T {
        if (lifecycle === 'Transient') return factory();

        const map = lifecycle === 'Singleton' ? DIContainer._singletons : this._scoped;
        if (!map.has(key)) {
            map.set(key, factory());
        }
        return map.get(key);
    }

    // Infrastructure (Singletons - Shared across all requests)
    private get companyRepo() { return this.resolve('CompanyRepo', 'Singleton', () => new CompanyRepository()); }
    private get candidateRepo() { return this.resolve('CandidateRepo', 'Singleton', () => new CandidateRepository()); }
    private get jobRepo() { return this.resolve('JobRepo', 'Singleton', () => new JobRepository()); }
    private get applicationRepo() { return this.resolve('ApplicationRepo', 'Singleton', () => new ApplicationRepository()); }
    private get aiCacheRepo() { return this.resolve('AICacheRepo', 'Singleton', () => new AIAnalysisCacheRepository()); }
    private get aiProvider() { return this.resolve('AIProvider', 'Singleton', () => new GeminiProvider()); }
    private get mailProvider() { return this.resolve('MailProvider', 'Singleton', () => new MailProvider()); }
    private get cvParsingService() { return this.resolve('CVParsingService', 'Singleton', () => new CVParsingService()); }

    // Use Cases (Transient - New instance per resolution)
    private get registerCompanyUC() { return this.resolve('RegisterCompanyUC', 'Transient', () => new RegisterCompanyUseCase(this.companyRepo, this.mailProvider)); }
    private get loginCompanyUC() { return this.resolve('LoginCompanyUC', 'Transient', () => new LoginCompanyUseCase(this.companyRepo)); }
    private get getCompanyStatsUC() { return this.resolve('GetCompanyStatsUC', 'Transient', () => new GetCompanyDashboardStatsUseCase()); }
    private get getCompanyProfileUC() { return this.resolve('GetCompanyProfileUC', 'Transient', () => new GetCompanyProfileUseCase(this.companyRepo)); }
    private get updateCompanyProfileUC() { return this.resolve('UpdateCompanyProfileUC', 'Transient', () => new UpdateCompanyProfileUseCase(this.companyRepo)); }

    private get createJobUC() { return this.resolve('CreateJobUC', 'Transient', () => new CreateJobUseCase(this.jobRepo)); }
    private get getJobsUC() { return this.resolve('GetJobsUC', 'Transient', () => new GetJobsUseCase(this.jobRepo)); }
    private get getJobByIdUC() { return this.resolve('GetJobByIdUC', 'Transient', () => new GetJobByIdUseCase(this.jobRepo)); }
    private get updateJobUC() { return this.resolve('UpdateJobUC', 'Transient', () => new UpdateJobUseCase(this.jobRepo)); }
    private get deleteJobUC() { return this.resolve('DeleteJobUC', 'Transient', () => new DeleteJobUseCase(this.jobRepo)); }
    private get closeJobUC() { return this.resolve('CloseJobUC', 'Transient', () => new CloseJobUseCase(this.jobRepo)); }
    private get assistJobUC() { return this.resolve('AssistJobUC', 'Transient', () => new AssistJobCreationUseCase(this.aiProvider)); }

    private get registerCandidateUC() { return this.resolve('RegisterCandidateUC', 'Transient', () => new RegisterCandidateUseCase(this.candidateRepo, this.mailProvider)); }
    private get loginCandidateUC() { return this.resolve('LoginCandidateUC', 'Transient', () => new LoginCandidateUseCase(this.candidateRepo)); }
    private get getCandidateProfileUC() { return this.resolve('GetCandidateProfileUC', 'Transient', () => new GetCandidateProfileUseCase(this.candidateRepo)); }
    private get updateCandidateProfileUC() { return this.resolve('UpdateCandidateProfileUseCase', 'Transient', () => new UpdateCandidateProfileUseCase(this.candidateRepo, this.aiProvider)); }
    private get extractCVDataUC() { return this.resolve('ExtractCVDataUC', 'Transient', () => new ExtractCVDataUseCase(this.aiProvider, this.cvParsingService)); }
    private get summarizeCandidateProfileUC() { return this.resolve('SummarizeCandidateProfileUC', 'Transient', () => new SummarizeCandidateProfileUseCase(this.candidateRepo, this.aiProvider)); }

    private get applyUC() { return this.resolve('ApplyUC', 'Transient', () => new ApplyForJobUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.mailProvider)); }
    private get getAppsUC() { return this.resolve('GetAppsUC', 'Transient', () => new GetApplicationsUseCase(this.applicationRepo, this.jobRepo)); }
    private get updateAppStatusUC() { return this.resolve('UpdateAppStatusUC', 'Transient', () => new UpdateApplicationStatusUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.mailProvider)); }
    private get evaluateAIUC() { return this.resolve('EvaluateAIUC', 'Transient', () => new EvaluateCompatibilityUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.aiProvider)); }
    private get simulateAIUC() { return this.resolve('SimulateAIUC', 'Transient', () => new SimulateCompatibilityUseCase(this.jobRepo, this.candidateRepo, this.aiProvider, this.aiCacheRepo)); }

    // Services (Scoped - One instance per HTTP Request)
    public get companyService() {
        return this.resolve('CompanyService', 'Scoped', () => new CompanyService(
            this.registerCompanyUC,
            this.loginCompanyUC,
            this.getCompanyStatsUC,
            this.getCompanyProfileUC,
            this.updateCompanyProfileUC
        ));
    }

    public get candidateService() {
        return this.resolve('CandidateService', 'Scoped', () => new CandidateService(
            this.registerCandidateUC, 
            this.loginCandidateUC, 
            this.getCandidateProfileUC, 
            this.updateCandidateProfileUC, 
            this.extractCVDataUC,
            this.summarizeCandidateProfileUC
        ));
    }

    public get jobService() {
        return this.resolve('JobService', 'Scoped', () => new JobService(this.createJobUC, this.getJobsUC, this.getJobByIdUC, this.updateJobUC, this.deleteJobUC, this.closeJobUC, this.assistJobUC));
    }

    public get applicationService() {
        return this.resolve('ApplicationService', 'Scoped', () => new ApplicationService(this.applyUC, this.getAppsUC, this.updateAppStatusUC, this.evaluateAIUC, this.simulateAIUC));
    }

    // Controllers (Transient - Re-resolved in routes)
    public get companyController() { return this.resolve('CompanyCtrl', 'Transient', () => new CompanyController(this.companyService)); }
    public get candidateController() { return this.resolve('CandidateCtrl', 'Transient', () => new CandidateController(this.candidateService)); }
    public get jobController() { return this.resolve('JobCtrl', 'Transient', () => new JobController(this.jobService)); }
    public get applicationController() { return this.resolve('ApplicationCtrl', 'Transient', () => new ApplicationController(this.applicationService)); }
}

export const container = new DIContainer();
