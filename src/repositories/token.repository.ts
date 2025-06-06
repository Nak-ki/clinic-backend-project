import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create(dto: any): Promise<IToken> {
        return Token.create(dto);
    }

    public async deleteOldTokens(params: Partial<IToken>): Promise<void> {
        await Token.deleteOne(params);
    }

    public findByParams(params: Partial<IToken>): Promise<IToken> {
        return Token.findOne(params);
    }
    public async deleteManyByParams(params: Partial<IToken>): Promise<void> {
        await Token.deleteMany(params);
    }
}

export const tokenRepository = new TokenRepository();
