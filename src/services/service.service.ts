import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IService,
    IServiceCreateDTO,
    IServiceQuery,
} from "../interfaces/service.interface";
import { serviceRepository } from "../repositories/service.repository";

class ServiceService {
    public async createService(body: IServiceCreateDTO): Promise<IService> {
        await this.isServiceUnique(body.name);
        return await serviceRepository.create(body);
    }

    public async getAllServices(query: IServiceQuery): Promise<{
        data: IService[];
        limit: number;
        page: number;
        total: number;
    }> {
        const [entities, limit, page, total] =
            await serviceRepository.getAll(query);
        return { data: entities, limit, page, total };
    }

    public async getServiceByName(name: string): Promise<void> {
        const service = await serviceRepository.getByParams(name);

        if (!service) {
            throw new ApiError(
                "This service is not exist",
                StatusCodesEnum.BED_REQUEST,
            );
        }
    }

    private async isServiceUnique(name: string): Promise<void> {
        const service = await serviceRepository.getByParams(name);

        if (service) {
            throw new ApiError(
                "Service is already exist",
                StatusCodesEnum.CONFLICT,
            );
        }
    }
}

export const serviceService = new ServiceService();
