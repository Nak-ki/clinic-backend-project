import { config } from "../configs/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
    IResetPasswordSend,
    IResetPasswordSet,
    IUser,
    IUserCreateDTO,
} from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenter";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signUp(
        user: IUserCreateDTO,
    ): Promise<{ user: Partial<IUser>; tokens: ITokenPair }> {
        await userService.isEmailUnique(user.email);
        const password = await passwordService.hashPassword(user.password);
        const admin = await userRepository.create({
            ...user,
            password,
            role: RoleEnum.ADMIN,
        });
        const tokens = tokenService.generateTokens({
            userId: admin._id,
            role: admin.role,
        });
        await tokenRepository.create({ ...tokens, _userId: admin._id });
        return { user: userPresenter.publicResDTO(admin), tokens };
    }

    public async signIn(
        dto: IAuth,
        user: IUser,
    ): Promise<{ user: Partial<IUser>; tokens: ITokenPair }> {
        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });

        await tokenRepository.deleteOldTokens({ _userId: user._id });

        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user: userPresenter.publicResDTO(user), tokens };
    }

    public async recoveryPasswordSendEmail(
        dto: IResetPasswordSend,
    ): Promise<void> {
        const user = await userRepository.getByEmail(dto.email);
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        const token = tokenService.generateActionToken(
            { userId: user._id, role: user.role },
            ActionTokenTypeEnum.RECOVERY_PASSWORD,
        );
        await actionTokenRepository.create({
            type: ActionTokenTypeEnum.RECOVERY_PASSWORD,
            _userId: user._id,
            token,
        });

        await emailService.sendMail(
            EmailTypeEnum.RECOVERY_PASSWORD,
            user.email,
            {
                name: user.name,
                actionToken: token,
                frontURL: config.FRONT_URL,
            },
        );
    }

    public async recoveryPasswordSet(
        dto: IResetPasswordSet,
        jwtPayload: ITokenPayload,
    ): Promise<void> {
        const password = await passwordService.hashPassword(dto.password);
        await userRepository.updateById(jwtPayload.userId, { password });

        await actionTokenRepository.deleteManyByParams({
            _userId: jwtPayload.userId,
            type: ActionTokenTypeEnum.RECOVERY_PASSWORD,
        });
        await tokenRepository.deleteManyByParams({
            _userId: jwtPayload.userId,
        });
    }
}

export const authService = new AuthService();
