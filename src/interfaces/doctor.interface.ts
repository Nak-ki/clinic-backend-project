import { IBase } from "./base.interface";

export interface IDoctor extends IBase {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: number;
    clinics: string[];
    services: string[];
}

export type ICreateDoctorDTO = Pick<
    IDoctor,
    "name" | "surname" | "email" | "phone"
> & { clinics: string; services: string };

export type ICreateDoctor = Pick<
    IDoctor,
    "name" | "surname" | "email" | "phone" | "clinics" | "services"
>;

export interface IDoctorQuery {
    limit?: number;
    page: number;
    order?: string;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    orderBy: string;
}
