import joi from "joi";

import { OrderEnum } from "../enums/order.enum";

export class ClinicValidator {
    private static name = joi.string().min(5).max(50).trim();

    public static create = joi.object({
        name: this.name.required(),
    });

    public static query = joi.object({
        limit: joi.number().min(1).max(100).default(10),
        page: joi.number().min(1).default(1),
        search: joi.string().trim(),
        order: joi.string().valid(...Object.values(OrderEnum)),
        service: joi.string().min(5),
        doctor: joi.string().min(3),
    });
}
