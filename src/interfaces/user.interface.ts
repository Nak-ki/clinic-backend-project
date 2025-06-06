import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

interface IUser extends IBase {
    _id?: string;
    email: string;
    password: string;
    role: RoleEnum;
    name: string;
    surname: string;
}

interface IUserRequest {
    email: string;
    password: string;
    role: RoleEnum;
    name: string;
    surname: string;
}

export type IResetPasswordSend = Pick<IUser, "email">;

export type IResetPasswordSet = Pick<IUser, "password"> & { token: string };

type IUserCreateDTO = Pick<IUser, "email" | "password" | "name" | "surname">;

export type { IUser, IUserCreateDTO, IUserRequest };
