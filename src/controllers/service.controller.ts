import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import {
    IServiceCreateDTO,
    IServiceQuery,
} from "../interfaces/service.interface";
import { serviceService } from "../services/service.service";

class ServiceController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IServiceCreateDTO;
            const data = await serviceService.createService(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getAllServices(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const query = req.query as unknown as IServiceQuery;
        const service = await serviceService.getAllServices(query);
        res.status(StatusCodesEnum.OK).json(service);
    }
}
export const serviceController = new ServiceController();
