import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        clinics: { type: [String], required: true },
        services: { type: [String], required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Doctor = model<IDoctor>("doctors", doctorSchema);
