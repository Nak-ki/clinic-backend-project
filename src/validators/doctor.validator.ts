import joi from "joi";

import { DoctorOrderByEnum } from "../enums/doctor-orderBy.enum";
import { OrderEnum } from "../enums/order.enum";

export class DoctorValidator {
    private static name = joi.string().min(3).max(15).trim();
    private static surname = joi.string().min(3).max(20).trim();
    private static email = joi
        .string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .trim();
    private static phone = joi
        .string()
        .trim()
        .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);
    private static clinics = joi.string().trim();
    private static services = joi.string().trim();

    public static create = joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        email: this.email.required(),
        phone: this.phone.required(),
        clinics: this.clinics.required(),
        services: this.services.required(),
    });

    public static query = joi.object({
        limit: joi.number().min(1).max(100).default(10),
        page: joi.number().min(1).default(1),
        search: joi.string().trim(),
        order: joi.string().valid(...Object.values(OrderEnum)),
        name: joi.string().min(3),
        surname: joi.string().min(3),
        email: joi.string().min(3),
        phone: joi.string().min(3),
        orderBy: joi.string().valid(...Object.values(DoctorOrderByEnum)),
    });
}
