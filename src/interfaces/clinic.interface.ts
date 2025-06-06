import { IBase } from "./base.interface";

export interface IClinic extends IBase {
    _id: string;
    name: string;
    services: string[];
    doctors: { name: string; _id: string }[];
}

export type ICreateClinic = Pick<IClinic, "name">;

export interface IClinicsQuery {
    limit?: number;
    page: number;
    search?: string;
    order?: string;
    service: string;
    doctor: string;
}
