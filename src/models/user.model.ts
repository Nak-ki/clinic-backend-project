import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: {
            enum: RoleEnum,
            type: String,
            required: true,
            default: RoleEnum.USER,
        },
        name: { type: String, required: true },
        surname: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const User = model<IUser>("user", userSchema);
