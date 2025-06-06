import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

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

    public async me(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            const { userId } = tokenPayload;
            const user = await userService.getById(userId);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (e) {
            next(e);
        }
    }

    public async refresh(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { role, userId } = req.res.locals
                .tokenPayload as ITokenPayload;
            const tokens = tokenService.generateTokens({ role, userId });
            await tokenRepository.create({
                ...tokens,
                _userId: userId,
            });
            res.status(StatusCodesEnum.OK).json({ tokens });
        } catch (e) {
            next(e);
        }
    }

    public async activateAccount(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const tokenPayload = req.res.locals.jwtPayload as ITokenPayload;
            console.log(tokenPayload);
            await authService.activateAccount(tokenPayload);

            res.sendStatus(StatusCodesEnum.OK);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
