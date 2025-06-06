import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async getById(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);

        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        return user;
    }

    public async isEmailUnique(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);

        if (user) {
            throw new ApiError(
                "User is already exists",
                StatusCodesEnum.BED_REQUEST,
            );
        }
    }
}

export const userService = new UserService();
