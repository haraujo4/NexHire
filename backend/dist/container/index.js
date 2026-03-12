"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const CompanyRepository_1 = require("../infrastructure/repositories/CompanyRepository");
const CandidateRepository_1 = require("../infrastructure/repositories/CandidateRepository");
const JobRepository_1 = require("../infrastructure/repositories/JobRepository");
const ApplicationRepository_1 = require("../infrastructure/repositories/ApplicationRepository");
const OpenAIProvider_1 = require("../infrastructure/providers/OpenAIProvider");
const CompanyService_1 = require("../application/services/CompanyService");
const CandidateService_1 = require("../application/services/CandidateService");
const JobService_1 = require("../application/services/JobService");
const ApplicationService_1 = require("../application/services/ApplicationService");
// Infrastructure
const companyRepo = new CompanyRepository_1.CompanyRepository();
const candidateRepo = new CandidateRepository_1.CandidateRepository();
const jobRepo = new JobRepository_1.JobRepository();
const applicationRepo = new ApplicationRepository_1.ApplicationRepository();
const aiProvider = new OpenAIProvider_1.OpenAIProvider();
// Services
const companyService = new CompanyService_1.CompanyService(companyRepo);
const candidateService = new CandidateService_1.CandidateService(candidateRepo);
const jobService = new JobService_1.JobService(jobRepo);
const applicationService = new ApplicationService_1.ApplicationService(applicationRepo, jobRepo, candidateRepo, aiProvider);
exports.container = {
    companyService,
    candidateService,
    jobService,
    applicationService
};
