import { NextFunction, Request, Response } from "express";

import { ICreateDoctorDTO } from "../interfaces/doctor.interface";
import { clinicService } from "../services/clinic.service";

class ClinicMiddleware {
    public async isClinicExist(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const dto = req.body as ICreateDoctorDTO;
            const clinicsArray = dto.clinics.split(", ");

            for (const clinic of clinicsArray) {
                await clinicService.checkClinicByName(clinic);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const clinicMiddleware = new ClinicMiddleware();
