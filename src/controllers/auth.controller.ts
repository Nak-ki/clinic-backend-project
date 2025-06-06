import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
// import { ITokenPayload } from "../interfaces/token.interface";
import {
    IResetPasswordSend,
    IResetPasswordSet,
    IUser,
    IUserCreateDTO,
} from "../interfaces/user.interface";
// import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
// import { tokenService } from "../services/token.service";
// import { userService } from "../services/user.service";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IUserCreateDTO;
            const data = await authService.signUp(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.res.locals.user as IUser;
            const dto = req.body as IAuth;
            const data = await authService.signIn(dto, user);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async recoveryPasswordSendEmail(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const dto = req.body as IResetPasswordSend;
            await authService.recoveryPasswordSendEmail(dto);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }

    public async recoveryPasswordSet(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
            const dto = req.body as IResetPasswordSet;

            await authService.recoveryPasswordSet(dto, jwtPayload);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
