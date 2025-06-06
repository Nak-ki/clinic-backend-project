import { NextFunction, Request, Response } from "express";

import { ICreateDoctorDTO } from "../interfaces/doctor.interface";
import { serviceService } from "../services/service.service";

class ServiceMiddleware {
    public async isServiceExist(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const dto = req.body as ICreateDoctorDTO;

            const serviceArray = dto.services.split(", ");

            for (const service of serviceArray) {
                await serviceService.getServiceByName(service);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const serviceMiddleware = new ServiceMiddleware();
