"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
class Job {
    constructor(id, companyId, title, description, requirements, salaryRange, location, isActive, isEliminatory, customForm, jobFingerprint, createdAt, updatedAt, _count) {
        this.id = id;
        this.companyId = companyId;
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.salaryRange = salaryRange;
        this.location = location;
        this.isActive = isActive;
        this.isEliminatory = isEliminatory;
        this.customForm = customForm;
        this.jobFingerprint = jobFingerprint;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._count = _count;
    }
}
exports.Job = Job;
