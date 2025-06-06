import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
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
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        await userService.isEmailUnique(user.email);
        const password = await passwordService.hashPassword(user.password);
        const newUser = await userRepository.create({ ...user, password });
        const tokens = tokenService.generateTokens({
            userId: newUser._id,
            role: newUser.role,
        });
        await tokenRepository.create({ ...tokens, _userId: newUser._id });
        const token = tokenService.generateActionToken(
            { userId: newUser._id, role: newUser.role },
            ActionTokenTypeEnum.ACTIVATE_ACCOUNT,
        );

        await actionTokenRepository.create({
            type: ActionTokenTypeEnum.ACTIVATE_ACCOUNT,
            _userId: newUser._id,
            token,
        });
        await emailService.sendMail(EmailTypeEnum.WELCOME, user.email, {
            name: user.name,
            actionToken: token,
            frontURL: "http://localhost:7000",
        });
        return { user: newUser, tokens };
    }

    public async signIn(
        dto: IAuth,
        user: IUser,
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
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
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return { user, tokens };
    }

    public async activateAccount(jwtPayload: ITokenPayload): Promise<void> {
        const user = await userRepository.getById(jwtPayload.userId);

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        await actionTokenRepository.deleteManyByParams({
            _userId: user._id,
            type: ActionTokenTypeEnum.ACTIVATE_ACCOUNT,
        });

        await userRepository.updateAccountStatus(jwtPayload.userId, {
            isActive: true,
        });
    }
}

export const authService = new AuthService();
