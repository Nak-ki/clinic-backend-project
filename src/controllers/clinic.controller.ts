import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IClinicsQuery, ICreateClinic } from "../interfaces/clinic.interface";
import { clinicService } from "../services/clinic.service";

class ClinicController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as ICreateClinic;
            const data = await clinicService.createClinic(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getAllClinics(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const query = req.query as unknown as IClinicsQuery;
        const service = await clinicService.getAllClinics(query);
        res.status(StatusCodesEnum.OK).json(service);
    }
}
export const clinicController = new ClinicController();
