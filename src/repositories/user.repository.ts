import { IUser, IUserRequest } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public create(user: IUserRequest): Promise<IUser> {
        return User.create(user);
    }

    public getById(userId: string): Promise<IUser> {
        return User.findById(userId);
    }
    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }
    public async updateById(
        userId: string,
        dto: Partial<IUser>,
    ): Promise<IUser> {
        return await User.findByIdAndUpdate(userId, dto, { new: true });
    }
}

export const userRepository = new UserRepository();
