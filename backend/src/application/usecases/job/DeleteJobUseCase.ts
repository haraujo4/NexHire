import { IJobRepository } from "../../../core/interfaces/IJobRepository";

export class DeleteJobUseCase {
    constructor(private readonly jobRepo: IJobRepository) { }

    async execute(id: string, companyId: string): Promise<void> {
        const job = await this.jobRepo.findById(id);
        if (!job) {
            throw new Error("Vaga não encontrada");
        }

        if (job.companyId !== companyId) {
            throw new Error("Acesso negado. Esta vaga não pertence à sua empresa.");
        }

        return this.jobRepo.delete(id);
    }
}
