import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { userRepository } from "../repositories/user.repository";

class UserMiddleware {
    public async isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.res.locals.jwtPayload as ITokenPayload;

            if (role !== RoleEnum.ADMIN) {
                throw new ApiError(
                    "This action just for admins",
                    StatusCodesEnum.FORBIDDEN,
                );
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    public async isUserExist(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IAuth;
            const user = await userRepository.getByEmail(dto.email);

            if (!user) {
                throw new ApiError(
                    "Email or password invalid",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }
            req.res.locals.user = user;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const userMiddleware = new UserMiddleware();
