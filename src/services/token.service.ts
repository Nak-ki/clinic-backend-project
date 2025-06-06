import jwt from "jsonwebtoken";

import { config } from "../configs/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.errors";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";

class TokenService {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: "20m",
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    public verifyToken(token: string, type: TokenTypeEnum): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case TokenTypeEnum.ACCESS:
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case TokenTypeEnum.REFRESH:
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError(
                        "Invalid token type",
                        StatusCodesEnum.BED_REQUEST,
                    );
            }
            return jwt.verify(token, secret) as ITokenPayload;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
        }
    }

    public async isTokenExists(
        token: string,
        type: TokenTypeEnum,
    ): Promise<boolean> {
        const iTokenPromise = await tokenRepository.findByParams({
            [type]: token,
        });
        return !!iTokenPromise;
    }

    public generateActionToken(
        payload: ITokenPayload,
        type: ActionTokenTypeEnum,
    ): string {
        let secret: string;
        // let expiresIn: string;

        switch (type) {
            case ActionTokenTypeEnum.ACTIVATE_ACCOUNT:
                secret = config.ACTION_ACTIVATE_SECRET;
                // expiresIn = config.ACTION_ACTIVATE_LIFETIME;
                break;
            default:
                throw new ApiError("Invalid token type", 400);
        }
        return jwt.sign(payload, secret, {
            expiresIn: "30m",
        });
    }
    public checkActionToken(
        token: string,
        type: ActionTokenTypeEnum,
    ): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case ActionTokenTypeEnum.ACTIVATE_ACCOUNT:
                    secret = config.ACTION_ACTIVATE_SECRET;
                    break;

                default:
                    throw new ApiError("Invalid token type", 500);
            }
            return jwt.verify(token, secret) as ITokenPayload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new ApiError("Invalid token", 401);
        }
    }
}

export const tokenService = new TokenService();
