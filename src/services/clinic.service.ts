import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IClinic,
    IClinicsQuery,
    ICreateClinic,
} from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    public async createClinic(body: ICreateClinic): Promise<IClinic> {
        await this.isClinicUnique(body.name);
        return await clinicRepository.create(body);
    }

    public async getAllClinics(query: IClinicsQuery): Promise<{
        data: IClinic[];
        limit: number;
        page: number;
        total: number;
    }> {
        const [entities, limit, page, total] =
            await clinicRepository.getAll(query);
        return { data: entities, limit, page, total };
    }

    public async checkClinicByName(name: string): Promise<void> {
        const clinic = await clinicRepository.getByParams(name);

        if (!clinic) {
            throw new ApiError(
                "This clinic is not exist",
                StatusCodesEnum.BED_REQUEST,
            );
        }
    }

    public async updateClinicDoctorsAndServices(
        name: string,
        doctor: { name: string; _id: string },
        services: string[],
    ): Promise<void> {
        const clinic = await clinicRepository.getByParams(name);

        clinic.doctors.push(doctor);

        for (const service of services) {
            if (!clinic.services.includes(service)) {
                clinic.services.push(service);
            }
        }

        await clinicRepository.update(clinic);
    }

    private async isClinicUnique(name: string): Promise<void> {
        const service = await clinicRepository.getByParams(name);

        if (service) {
            throw new ApiError(
                "Clinic is already exist",
                StatusCodesEnum.CONFLICT,
            );
        }
    }
}

export const clinicService = new ClinicService();
