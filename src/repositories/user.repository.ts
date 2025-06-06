import { FilterQuery } from "mongoose";

import {
    IUser,
    IUserCreateDTO,
    IUserQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public getAll(query: IUserQuery): Promise<IUser[]> {
        // const skip = query.pageSize * (query.page - 1);
        const filterObject: FilterQuery<IUser> = { isDeleted: false };

        if (query.search) {
            filterObject.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { surname: { $regex: query.search, $options: "i" } },
            ];
        }

        const orderObject = {};
        if (query.order) {
            if (query.order.startsWith("-")) {
                orderObject[query.order.slice(1)] = -1;
            } else {
                orderObject[query.order] = 1;
            }
        }
        return User.aggregate([
            {
                $match: filterObject,
            },
            {
                $sort: orderObject,
            },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    data: { $push: "$$ROOT" },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);
    }
    public create(user: IUserCreateDTO): Promise<IUser> {
        return User.create(user);
    }
    public getById(userId: string): Promise<IUser> {
        return User.findById(userId);
    }
    public updateById(userId: string, user: Partial<IUser>): Promise<IUser> {
        return User.findByIdAndUpdate(userId, user, { new: true });
    }
    public deleteById(userId: string): Promise<IUser> {
        return User.findByIdAndDelete(userId);
    }
    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }
    public async bannedById(
        userId: string,
        dto: { isActive: boolean },
    ): Promise<IUser> {
        return await User.findByIdAndUpdate(
            userId,
            { isActive: dto.isActive },
            { new: true },
        );
    }
    public updateAccountStatus(
        userId: string,
        isActive: { isActive: boolean },
    ): Promise<IUser> {
        return User.findByIdAndUpdate(userId, isActive, { new: true });
    }
}

export const userRepository = new UserRepository();
