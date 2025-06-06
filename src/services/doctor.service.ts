import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    ICreateDoctorDTO,
    IDoctor,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { clinicService } from "./clinic.service";

class DoctorService {
    public async createDoctor(body: ICreateDoctorDTO): Promise<IDoctor> {
        await this.isEmailUnique(body.email);
        const serviceArray = body.services.split(", ");
        const clinicsArray = body.clinics.split(", ");

        const dto = { ...body, services: serviceArray, clinics: clinicsArray };

        const doctor = await doctorRepository.create(dto);

        doctor.clinics.map(
            async (clinic) =>
                await clinicService.updateClinicDoctorsAndServices(
                    clinic,
                    {
                        name: `${doctor.name} ${doctor.surname}`,
                        _id: doctor._id,
                    },
                    serviceArray,
                ),
        );

        return doctor;
    }

    public async getAllDoctors(query: IDoctorQuery): Promise<{
        data: IDoctor[];
        limit: number;
        page: number;
        total: number;
    }> {
        const [entities, limit, page, total] =
            await doctorRepository.getAll(query);
        return { data: entities, limit, page, total };
    }

    private async isEmailUnique(email: string): Promise<void> {
        const doctor = await doctorRepository.getByParams(email);

        if (doctor) {
            throw new ApiError(
                "Doctor is already exist",
                StatusCodesEnum.CONFLICT,
            );
        }
    }
}

export const doctorService = new DoctorService();
