"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.DIContainer = void 0;
// Infrastructure Providers & Repositories
const CompanyRepository_1 = require("../repositories/CompanyRepository");
const CandidateRepository_1 = require("../repositories/CandidateRepository");
const JobRepository_1 = require("../repositories/JobRepository");
const ApplicationRepository_1 = require("../repositories/ApplicationRepository");
const GeminiProvider_1 = require("../providers/GeminiProvider");
const MailProvider_1 = require("../providers/MailProvider");
const AIAnalysisCacheRepository_1 = require("../repositories/AIAnalysisCacheRepository");
const CVParsingService_1 = require("../services/CVParsingService");
// Use Cases
const CreateJobUseCase_1 = require("../../application/usecases/job/CreateJobUseCase");
const GetJobsUseCase_1 = require("../../application/usecases/job/GetJobsUseCase");
const GetJobByIdUseCase_1 = require("../../application/usecases/job/GetJobByIdUseCase");
const UpdateJobUseCase_1 = require("../../application/usecases/job/UpdateJobUseCase");
const DeleteJobUseCase_1 = require("../../application/usecases/job/DeleteJobUseCase");
const CloseJobUseCase_1 = require("../../application/usecases/job/CloseJobUseCase");
const AssistJobCreationUseCase_1 = require("../../application/usecases/job/AssistJobCreationUseCase");
const RegisterCompanyUseCase_1 = require("../../application/usecases/company/RegisterCompanyUseCase");
const LoginCompanyUseCase_1 = require("../../application/usecases/company/LoginCompanyUseCase");
const GetCompanyDashboardStatsUseCase_1 = require("../../application/usecases/company/GetCompanyDashboardStatsUseCase");
const GetCompanyProfileUseCase_1 = require("../../application/usecases/company/GetCompanyProfileUseCase");
const UpdateCompanyProfileUseCase_1 = require("../../application/usecases/company/UpdateCompanyProfileUseCase");
const RegisterCandidateUseCase_1 = require("../../application/usecases/candidate/RegisterCandidateUseCase");
const LoginCandidateUseCase_1 = require("../../application/usecases/candidate/LoginCandidateUseCase");
const GetCandidateProfileUseCase_1 = require("../../application/usecases/candidate/GetCandidateProfileUseCase");
const UpdateCandidateProfileUseCase_1 = require("../../application/usecases/candidate/UpdateCandidateProfileUseCase");
const ExtractCVDataUseCase_1 = require("../../application/usecases/candidate/ExtractCVDataUseCase");
const SummarizeCandidateProfileUseCase_1 = require("../../application/usecases/candidate/SummarizeCandidateProfileUseCase");
const ApplyForJobUseCase_1 = require("../../application/usecases/application/ApplyForJobUseCase");
const GetApplicationsUseCase_1 = require("../../application/usecases/application/GetApplicationsUseCase");
const UpdateApplicationStatusUseCase_1 = require("../../application/usecases/application/UpdateApplicationStatusUseCase");
const EvaluateCompatibilityUseCase_1 = require("../../application/usecases/application/EvaluateCompatibilityUseCase");
const SimulateCompatibilityUseCase_1 = require("../../application/usecases/application/SimulateCompatibilityUseCase");
// Services
const CompanyService_1 = require("../../application/services/CompanyService");
const CandidateService_1 = require("../../application/services/CandidateService");
const JobService_1 = require("../../application/services/JobService");
const ApplicationService_1 = require("../../application/services/ApplicationService");
// Controllers
const CompanyController_1 = require("../../application/controllers/CompanyController");
const CandidateController_1 = require("../../application/controllers/CandidateController");
const JobController_1 = require("../../application/controllers/JobController");
const ApplicationController_1 = require("../../application/controllers/ApplicationController");
class DIContainer {
    constructor() {
        this._scoped = new Map();
    }
    // Centralized Resolution Logic
    resolve(key, lifecycle, factory) {
        if (lifecycle === 'Transient')
            return factory();
        const map = lifecycle === 'Singleton' ? DIContainer._singletons : this._scoped;
        if (!map.has(key)) {
            map.set(key, factory());
        }
        return map.get(key);
    }
    // Infrastructure (Singletons - Shared across all requests)
    get companyRepo() { return this.resolve('CompanyRepo', 'Singleton', () => new CompanyRepository_1.CompanyRepository()); }
    get candidateRepo() { return this.resolve('CandidateRepo', 'Singleton', () => new CandidateRepository_1.CandidateRepository()); }
    get jobRepo() { return this.resolve('JobRepo', 'Singleton', () => new JobRepository_1.JobRepository()); }
    get applicationRepo() { return this.resolve('ApplicationRepo', 'Singleton', () => new ApplicationRepository_1.ApplicationRepository()); }
    get aiCacheRepo() { return this.resolve('AICacheRepo', 'Singleton', () => new AIAnalysisCacheRepository_1.AIAnalysisCacheRepository()); }
    get aiProvider() { return this.resolve('AIProvider', 'Singleton', () => new GeminiProvider_1.GeminiProvider()); }
    get mailProvider() { return this.resolve('MailProvider', 'Singleton', () => new MailProvider_1.MailProvider()); }
    get cvParsingService() { return this.resolve('CVParsingService', 'Singleton', () => new CVParsingService_1.CVParsingService()); }
    // Use Cases (Transient - New instance per resolution)
    get registerCompanyUC() { return this.resolve('RegisterCompanyUC', 'Transient', () => new RegisterCompanyUseCase_1.RegisterCompanyUseCase(this.companyRepo, this.mailProvider)); }
    get loginCompanyUC() { return this.resolve('LoginCompanyUC', 'Transient', () => new LoginCompanyUseCase_1.LoginCompanyUseCase(this.companyRepo)); }
    get getCompanyStatsUC() { return this.resolve('GetCompanyStatsUC', 'Transient', () => new GetCompanyDashboardStatsUseCase_1.GetCompanyDashboardStatsUseCase()); }
    get getCompanyProfileUC() { return this.resolve('GetCompanyProfileUC', 'Transient', () => new GetCompanyProfileUseCase_1.GetCompanyProfileUseCase(this.companyRepo)); }
    get updateCompanyProfileUC() { return this.resolve('UpdateCompanyProfileUC', 'Transient', () => new UpdateCompanyProfileUseCase_1.UpdateCompanyProfileUseCase(this.companyRepo)); }
    get createJobUC() { return this.resolve('CreateJobUC', 'Transient', () => new CreateJobUseCase_1.CreateJobUseCase(this.jobRepo)); }
    get getJobsUC() { return this.resolve('GetJobsUC', 'Transient', () => new GetJobsUseCase_1.GetJobsUseCase(this.jobRepo)); }
    get getJobByIdUC() { return this.resolve('GetJobByIdUC', 'Transient', () => new GetJobByIdUseCase_1.GetJobByIdUseCase(this.jobRepo)); }
    get updateJobUC() { return this.resolve('UpdateJobUC', 'Transient', () => new UpdateJobUseCase_1.UpdateJobUseCase(this.jobRepo)); }
    get deleteJobUC() { return this.resolve('DeleteJobUC', 'Transient', () => new DeleteJobUseCase_1.DeleteJobUseCase(this.jobRepo)); }
    get closeJobUC() { return this.resolve('CloseJobUC', 'Transient', () => new CloseJobUseCase_1.CloseJobUseCase(this.jobRepo)); }
    get assistJobUC() { return this.resolve('AssistJobUC', 'Transient', () => new AssistJobCreationUseCase_1.AssistJobCreationUseCase(this.aiProvider)); }
    get registerCandidateUC() { return this.resolve('RegisterCandidateUC', 'Transient', () => new RegisterCandidateUseCase_1.RegisterCandidateUseCase(this.candidateRepo, this.mailProvider)); }
    get loginCandidateUC() { return this.resolve('LoginCandidateUC', 'Transient', () => new LoginCandidateUseCase_1.LoginCandidateUseCase(this.candidateRepo)); }
    get getCandidateProfileUC() { return this.resolve('GetCandidateProfileUC', 'Transient', () => new GetCandidateProfileUseCase_1.GetCandidateProfileUseCase(this.candidateRepo)); }
    get updateCandidateProfileUC() { return this.resolve('UpdateCandidateProfileUseCase', 'Transient', () => new UpdateCandidateProfileUseCase_1.UpdateCandidateProfileUseCase(this.candidateRepo, this.aiProvider)); }
    get extractCVDataUC() { return this.resolve('ExtractCVDataUC', 'Transient', () => new ExtractCVDataUseCase_1.ExtractCVDataUseCase(this.aiProvider, this.cvParsingService)); }
    get summarizeCandidateProfileUC() { return this.resolve('SummarizeCandidateProfileUC', 'Transient', () => new SummarizeCandidateProfileUseCase_1.SummarizeCandidateProfileUseCase(this.candidateRepo, this.aiProvider)); }
    get applyUC() { return this.resolve('ApplyUC', 'Transient', () => new ApplyForJobUseCase_1.ApplyForJobUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.mailProvider)); }
    get getAppsUC() { return this.resolve('GetAppsUC', 'Transient', () => new GetApplicationsUseCase_1.GetApplicationsUseCase(this.applicationRepo, this.jobRepo)); }
    get updateAppStatusUC() { return this.resolve('UpdateAppStatusUC', 'Transient', () => new UpdateApplicationStatusUseCase_1.UpdateApplicationStatusUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.mailProvider)); }
    get evaluateAIUC() { return this.resolve('EvaluateAIUC', 'Transient', () => new EvaluateCompatibilityUseCase_1.EvaluateCompatibilityUseCase(this.applicationRepo, this.jobRepo, this.candidateRepo, this.aiProvider)); }
    get simulateAIUC() { return this.resolve('SimulateAIUC', 'Transient', () => new SimulateCompatibilityUseCase_1.SimulateCompatibilityUseCase(this.jobRepo, this.candidateRepo, this.aiProvider, this.aiCacheRepo)); }
    // Services (Scoped - One instance per HTTP Request)
    get companyService() {
        return this.resolve('CompanyService', 'Scoped', () => new CompanyService_1.CompanyService(this.registerCompanyUC, this.loginCompanyUC, this.getCompanyStatsUC, this.getCompanyProfileUC, this.updateCompanyProfileUC));
    }
    get candidateService() {
        return this.resolve('CandidateService', 'Scoped', () => new CandidateService_1.CandidateService(this.registerCandidateUC, this.loginCandidateUC, this.getCandidateProfileUC, this.updateCandidateProfileUC, this.extractCVDataUC, this.summarizeCandidateProfileUC));
    }
    get jobService() {
        return this.resolve('JobService', 'Scoped', () => new JobService_1.JobService(this.createJobUC, this.getJobsUC, this.getJobByIdUC, this.updateJobUC, this.deleteJobUC, this.closeJobUC, this.assistJobUC));
    }
    get applicationService() {
        return this.resolve('ApplicationService', 'Scoped', () => new ApplicationService_1.ApplicationService(this.applyUC, this.getAppsUC, this.updateAppStatusUC, this.evaluateAIUC, this.simulateAIUC));
    }
    // Controllers (Transient - Re-resolved in routes)
    get companyController() { return this.resolve('CompanyCtrl', 'Transient', () => new CompanyController_1.CompanyController(this.companyService)); }
    get candidateController() { return this.resolve('CandidateCtrl', 'Transient', () => new CandidateController_1.CandidateController(this.candidateService)); }
    get jobController() { return this.resolve('JobCtrl', 'Transient', () => new JobController_1.JobController(this.jobService)); }
    get applicationController() { return this.resolve('ApplicationCtrl', 'Transient', () => new ApplicationController_1.ApplicationController(this.applicationService)); }
}
exports.DIContainer = DIContainer;
DIContainer._singletons = new Map();
exports.container = new DIContainer();
