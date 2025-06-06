import { IBase } from "./base.interface";

export interface IService extends IBase {
    _id: string;
    name: string;
}
export type IServiceCreateDTO = Pick<IService, "name">;

export interface IServiceQuery {
    limit?: number;
    page: number;
    search?: string;
    order?: string;
}
