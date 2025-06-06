import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ICreateDoctorDTO, IDoctorQuery } from "../interfaces/doctor.interface";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as ICreateDoctorDTO;
            const data = await doctorService.createDoctor(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getAllDoctors(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const query = req.query as unknown as IDoctorQuery;
        const result = await doctorService.getAllDoctors(query);
        res.status(StatusCodesEnum.OK).json(result);
    }
}
export const doctorController = new DoctorController();
